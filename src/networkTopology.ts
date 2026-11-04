// ── External Dependencies & Registrations
import { box, Geometry, type Hit, icosphere, InstancedMesh, Lines, Points, View } from 'phoria2';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

export interface NetworkTopologyData {
    links: NetworkTopologyLink[];
    nodes: NetworkTopologyNode[];
}

export interface NetworkTopologyNode {
    address: string;
    id: string;
    label: string;
    load: number; // Percentage, 0 to 100.
    position: NetworkTopologyPosition;
    statusId: NetworkTopologyStatusId;
    typeId: NetworkTopologyNodeTypeId;
}

export type NetworkTopologyPosition = [number, number, number];

export type NetworkTopologyStatusId = 'degraded' | 'down' | 'healthy';

export type NetworkTopologyNodeTypeId = 'database' | 'router' | 'server' | 'switch';

export interface NetworkTopologyLink {
    source: string;
    target: string;
}

export interface NetworkTopologyOptions {
    labelsShowOnlyProblems?: boolean;
    trafficIsShown?: boolean;
}

export interface NetworkTopologyHandle {
    canvas: HTMLCanvasElement;
    destroy: () => void;
    resize: () => void;
}

// A node with the indexes of its neighbours, which hovering and tooltips read.
interface TopologyRow extends NetworkTopologyNode {
    index: number;
    neighbourIndexes: number[];
}

type LinkIndexes = [number, number];

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const STATUS = {
    healthy: { color: '#59a14f', label: 'Healthy', rank: 0 },
    degraded: { color: '#f2b134', label: 'Degraded', rank: 1 },
    down: { color: '#e15759', label: 'Down', rank: 2 }
} satisfies Record<NetworkTopologyStatusId, { color: string; label: string; rank: number }>;

const TYPE_LABELS = {
    router: 'Core router',
    switch: 'Distribution switch',
    server: 'Server',
    database: 'Database'
} satisfies Record<NetworkTopologyNodeTypeId, string>;

// How far each node's surface is from its middle, so a hovered link stops short of it and its arrow shows.
const SURFACE_RADIUS = { router: 0.8, switch: 0.55, server: 0.45, database: 0.45 } satisfies Record<NetworkTopologyNodeTypeId, number>;

const COLOR = {
    background: '#14161c',
    highlight: '#ffffff',
    linkBroken: '#a8474c',
    linkHovered: '#7fd3ff',
    linkLive: '#3b4358',
    packet: '#9fe8ff',
    text: '#e6e8ee',
    textDim: '#9aa1b2'
};

const PACKET_PHASE_STEP = 0.618034; // The golden ratio's fraction, which spreads any number of phases evenly round the cycle.

// Label styles go in a stylesheet because phoria2 creates the label elements itself and only takes a class name.
// ':where' keeps the rules weak, so a page can still restyle the labels.
const STYLE_ELEMENT_ID = 'dpuse-phoria2-visualiser-style';
const LABEL_CLASS_NAME = 'dpuse-phoria2-label';
const STYLE = `:where(.${LABEL_CLASS_NAME}) { padding: 1px 5px; border-radius: 4px; background: rgb(16 16 20 / 70%); color: ${COLOR.text}; font-size: 11px; font-variant-numeric: tabular-nums; }`;

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * Draws a network as a 3D map: hubs as spheres and hosts as boxes, coloured by status. Hovering a node shows its
 * details and draws its links as moving dashed arrows. Links to a node that is down are dashed in red, and packets run
 * along the live links at a speed set by load. Based on phoria2's topology demo.
 */
export function renderNetworkTopology(data: NetworkTopologyData, renderTo: HTMLElement, options: NetworkTopologyOptions = {}): NetworkTopologyHandle {
    const { labelsShowOnlyProblems = false, trafficIsShown = true } = options;
    const { links, rows } = constructRows(data);
    ensureStyle();

    // The labels phoria2 adds beside the canvas are positioned against this frame, as are the legend and summary.
    const frame = document.createElement('div');
    Object.assign(frame.style, { height: '100%', overflow: 'hidden', position: 'relative', width: '100%' });
    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, { display: 'block', height: '100%', width: '100%' });
    frame.append(canvas);
    renderTo.append(frame);

    const view = new View({
        background: COLOR.background,
        camera: { position: [0, 26, 15], target: [0, 2, 0] }, // Looking down from above and in front, so the rings read as a map.
        canvas,
        description: 'Network topology. Use the arrow keys to step through the nodes.',
        highlight: COLOR.highlight,
        keyboard: true,
        orbit: true,
        tooltip: (hit: Hit) => {
            const row = hit.datum as TopologyRow | undefined;
            if (!row) return null;
            const rows = { Type: TYPE_LABELS[row.typeId], Status: STATUS[row.statusId].label, Load: `${String(row.load)}%`, Links: row.neighbourIndexes.length, Address: row.address };
            return { rows, title: row.label };
        }
    });
    const { scene } = view;
    scene.environment = 'studio';

    // Nodes ─ Hubs are spheres and hosts are boxes. When labels collide, problem hosts win over healthy ones.
    const hubRows = rows.filter((row) => row.typeId === 'router' || row.typeId === 'switch');
    const hostRows = rows.filter((row) => row.typeId === 'server' || row.typeId === 'database');
    scene.add(
        new InstancedMesh({
            data: hubRows,
            geometry: icosphere({ detail: 2, radius: 1 }),
            instances: hubRows.map((row) => ({ color: STATUS[row.statusId].color, position: row.position, scale: row.typeId === 'router' ? 0.8 : 0.55 })),
            labels: { className: LABEL_CLASS_NAME, occlude: true, place: 'above', priority: 5, text: (row: TopologyRow) => row.label },
            material: { roughness: 0.35 }
        })
    );
    scene.add(
        new InstancedMesh({
            data: hostRows,
            geometry: box(1),
            instances: hostRows.map((row) => ({
                color: STATUS[row.statusId].color,
                position: row.position,
                scale: row.typeId === 'database' ? [0.7, 1.1, 0.7] : [0.6, 0.6, 0.6]
            })),
            labels: {
                className: LABEL_CLASS_NAME,
                occlude: true,
                place: 'below',
                priority: (row: TopologyRow) => STATUS[row.statusId].rank,
                text: (row: TopologyRow) => (labelsShowOnlyProblems && row.statusId === 'healthy' ? null : row.label)
            },
            material: { roughness: 0.5 }
        })
    );

    // Links ─ Working links are dim and solid, and links to a node that is down are dashed in red. The hovered node's
    // links are drawn again on top, bright and dashed, with an arrow to each neighbour.
    const linkPositions = ([a, b]: LinkIndexes): number[] => [...rowAt(rows, a).position, ...rowAt(rows, b).position];
    const linkIsBroken = ([a, b]: LinkIndexes): boolean => rowAt(rows, a).statusId === 'down' || rowAt(rows, b).statusId === 'down';
    const liveLinks = links.filter((link) => !linkIsBroken(link));
    const brokenLinks = links.filter((link) => linkIsBroken(link));
    const liveLinkGeometry = new Geometry({ positions: liveLinks.flatMap((link) => linkPositions(link)) });
    const brokenLinkGeometry = new Geometry({ positions: brokenLinks.flatMap((link) => linkPositions(link)) });
    const hoveredLinkGeometry = new Geometry({ positions: new Float32Array(links.length * 6) });
    hoveredLinkGeometry.drawCount = 0;
    scene.add(new Lines({ geometry: liveLinkGeometry, material: { color: COLOR.linkLive, width: 1.5 }, pickable: false }));
    scene.add(new Lines({ geometry: brokenLinkGeometry, material: { color: COLOR.linkBroken, dash: 0.35, gap: 0.25, width: 1.5 }, pickable: false }));
    const hoveredLinks = scene.add(
        new Lines({ arrows: 'end', geometry: hoveredLinkGeometry, material: { color: COLOR.linkHovered, dash: 0.6, gap: 0.3, width: 3 }, pickable: false })
    );

    // Traffic ─ One packet per live link, running back and forth. The phases are spread evenly rather than at random,
    // so the same network always starts the same way.
    const packetGeometry = new Geometry({ positions: new Float32Array(liveLinks.length * 3) });
    const packets = scene.add(new Points({ geometry: packetGeometry, material: { color: COLOR.packet, size: 0.22 }, pickable: false }));
    packets.visible = trafficIsShown;
    const packetPhases = liveLinks.map((_, index) => (index * PACKET_PHASE_STEP) % 1);
    const packetSpeeds = liveLinks.map(([a, b]) => 0.15 + (rowAt(rows, a).load + rowAt(rows, b).load) / 400);

    // Legend and summary
    const summaryText = constructSummaryText(rows);
    const summaryElement = constructSummaryElement(summaryText);
    frame.append(constructLegendElement(), summaryElement);

    view.on('hover', (hit) => {
        const row = hit?.datum as TopologyRow | undefined;
        const ownLinks = row ? links.filter(([a, b]) => a === row.index || b === row.index) : [];
        const positions = row ? ownLinks.flatMap(([a, b]) => constructOutwardSegment(row, rowAt(rows, a === row.index ? b : a))) : [];
        hoveredLinks.geometry.positions.set(positions);
        hoveredLinks.geometry.drawCount = ownLinks.length * 2;
        hoveredLinks.geometry.needsUpdate();
    });
    view.on('click', (hit) => {
        const row = hit?.datum as TopologyRow | undefined;
        summaryElement.textContent = row
            ? `${row.label}: ${STATUS[row.statusId].label.toLowerCase()}, ${String(row.load)}% load, ${String(row.neighbourIndexes.length)} links`
            : summaryText;
    });

    view.frame(scene, { padding: 0.08 });
    view.start((dt) => {
        if (hoveredLinks.geometry.drawCount) hoveredLinks.material.dashOffset += dt * 1.5; // The hovered node's traffic flows out to its neighbours.
        if (!trafficIsShown) return;
        const positions = packets.geometry.positions;
        for (const [linkIndex, [a, b]] of liveLinks.entries()) {
            const phase = ((packetPhases[linkIndex] ?? 0) + dt * (packetSpeeds[linkIndex] ?? 0)) % 2;
            packetPhases[linkIndex] = phase;
            const progress = phase < 1 ? phase : 2 - phase; // 0 to 1 is out, 1 to 2 is back.
            positions.set(interpolatePosition(rowAt(rows, a).position, rowAt(rows, b).position, progress), linkIndex * 3);
        }
        packets.geometry.needsUpdate();
    });

    return {
        canvas,
        destroy: () => {
            view.dispose();
            frame.remove();
        },
        resize: () => {
            view.resize();
            view.render();
        }
    };
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// Links name nodes by id, but phoria2 hands back rows by position, so both become indexes into one row list.
function constructRows(data: NetworkTopologyData): { links: LinkIndexes[]; rows: TopologyRow[] } {
    const rows: TopologyRow[] = data.nodes.map((node, index) => ({ ...node, index, neighbourIndexes: [] }));
    const indexById = new Map(rows.map((row) => [row.id, row.index]));
    const links: LinkIndexes[] = [];
    for (const link of data.links) {
        const a = indexById.get(link.source);
        const b = indexById.get(link.target);
        if (a === undefined || b === undefined) continue; // A link to a node that is not in the data has nothing to join.
        links.push([a, b]);
        rowAt(rows, a).neighbourIndexes.push(b);
        rowAt(rows, b).neighbourIndexes.push(a);
    }
    return { links, rows };
}

// A segment from one node out to another, stopping at each one's surface so the arrow at its end shows.
function constructOutwardSegment(from: TopologyRow, to: TopologyRow): number[] {
    const a = from.position;
    const b = to.position;
    const distance = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) || 1;
    const fromRatio = SURFACE_RADIUS[from.typeId] / distance;
    const toRatio = (SURFACE_RADIUS[to.typeId] + 0.15) / distance;
    return [...interpolatePosition(a, b, fromRatio), ...interpolatePosition(b, a, toRatio)];
}

function constructLegendElement(): HTMLDivElement {
    const legend = document.createElement('div');
    Object.assign(legend.style, {
        background: 'rgb(16 16 20 / 70%)',
        borderRadius: '6px',
        bottom: '12px',
        color: COLOR.text,
        display: 'flex',
        flexDirection: 'column',
        fontSize: '12px',
        gap: '4px',
        left: '12px',
        padding: '8px 10px',
        position: 'absolute'
    });
    const title = document.createElement('div');
    Object.assign(title.style, { color: COLOR.textDim, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' });
    title.textContent = 'Status';
    legend.append(title);
    for (const status of Object.values(STATUS)) {
        const item = document.createElement('div');
        Object.assign(item.style, { alignItems: 'center', display: 'flex', gap: '8px' });
        const swatch = document.createElement('span');
        Object.assign(swatch.style, { background: status.color, borderRadius: '3px', height: '12px', width: '12px' });
        item.append(swatch, status.label);
        legend.append(item);
    }
    return legend;
}

// Live, so a screen reader hears the details of a node when it is clicked.
function constructSummaryElement(text: string): HTMLDivElement {
    const summary = document.createElement('div');
    summary.setAttribute('aria-live', 'polite');
    Object.assign(summary.style, { color: COLOR.text, fontSize: '12px', left: '12px', pointerEvents: 'none', position: 'absolute', top: '10px' });
    summary.textContent = text;
    return summary;
}

function constructSummaryText(rows: TopologyRow[]): string {
    const downCount = rows.filter((row) => row.statusId === 'down').length;
    const degradedCount = rows.filter((row) => row.statusId === 'degraded').length;
    return `${String(rows.length)} nodes: ${String(downCount)} down, ${String(degradedCount)} degraded. Hover to trace links.`;
}

function ensureStyle(): void {
    if (document.querySelector(`#${STYLE_ELEMENT_ID}`)) return;
    const style = document.createElement('style');
    style.id = STYLE_ELEMENT_ID;
    style.textContent = STYLE;
    document.head.append(style);
}

function interpolatePosition(from: NetworkTopologyPosition, to: NetworkTopologyPosition, ratio: number): NetworkTopologyPosition {
    return [from[0] + (to[0] - from[0]) * ratio, from[1] + (to[1] - from[1]) * ratio, from[2] + (to[2] - from[2]) * ratio];
}

function rowAt(rows: TopologyRow[], index: number): TopologyRow {
    const row = rows[index];
    if (!row) throw new Error(`No network topology row at index ${String(index)}.`);
    return row;
}
