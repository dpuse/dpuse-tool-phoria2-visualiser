// ── External Dependencies & Registrations
import { Geometry, type Hit, icosphere, InstancedMesh, Lines, View } from 'phoria2';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// The data and options match the d3 visualiser's network diagram, so one caller can draw the same network with either.
export interface NetworkDiagramData {
    links: NetworkDiagramLink[];
    nodes: NetworkDiagramNode[];
}

export interface NetworkDiagramNode {
    id: string;
    label?: string; // Shown below the node. Without one, the id is shown.
    level?: number; // The node's depth in a hierarchy, from 0 at the top. Sets its size and colour. Without one, 1.
}

export interface NetworkDiagramLink {
    source: string;
    target: string;
}

export interface NetworkDiagramOptions {
    onNodeClick?: (node: NetworkDiagramNode) => void; // Also called when Enter or Space is pressed on a node reached with the arrow keys.
}

export interface NetworkDiagramHandle {
    canvas: HTMLCanvasElement;
    destroy: () => void;
    resize: () => void;
}

type Position = [number, number, number];

// A node with its place in the tree the links form, which the layout reads.
interface DiagramRow {
    childIndexes: number[];
    depth: number; // How many links the node is from the top of its tree, which may differ from its 'level'.
    index: number;
    leafCount: number; // The nodes below it that have no children, or 1 for a node with none. Sets its share of the ring.
    node: NetworkDiagramNode;
    position: Position;
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const DEFAULT_LEVEL = 1; // As in the d3 visualiser, so a node with no level looks the same in both.
const RING_GAP = 6; // How much further from the middle each depth sits than the one above it.
const TIER_GAP = 2.5; // How much lower each depth sits than the one above it.

const COLOR = {
    highlight: '#f59e0b',
    link: '#9ca3af'
};

// One entry for each level, from the top of the hierarchy down, in the d3 visualiser's colours. A deeper level uses the
// last entry.
const LEVEL_STYLES = [
    { color: '#475569', radius: 1 },
    { color: '#2563eb', radius: 0.75 },
    { color: '#0d9488', radius: 0.55 },
    { color: '#7c3aed', radius: 0.42 },
    { color: '#db2777', radius: 0.34 }
] as const;

// Label styles go in a stylesheet because phoria2 creates the label elements itself and only takes a class name. The
// labels take the page's own text colour, so they follow its light or dark theme. ':where' keeps the rules weak, so a
// page can still restyle the labels.
const STYLE_ELEMENT_ID = 'dpuse-phoria2-network-diagram-style';
const LABEL_CLASS_NAME = 'dpuse-phoria2-network-diagram-label';
const STYLE = `:where(.${LABEL_CLASS_NAME}) { color: inherit; font-size: 11px; white-space: nowrap; }`;

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * Draws a network in 3D as a layered tree: the top node in the middle, its children on a ring around it, and each
 * deeper level on a wider ring one tier lower. The background is transparent, so the page's theme shows through.
 * The arrow keys step through the nodes, and Enter or Space clicks the one stepped to.
 */
export function renderNetworkDiagram(data: NetworkDiagramData, renderTo: HTMLElement, options: NetworkDiagramOptions = {}): NetworkDiagramHandle {
    const { links, rows } = constructRows(data);
    ensureStyle();

    // The labels phoria2 adds beside the canvas are positioned against this frame.
    const frame = document.createElement('div');
    Object.assign(frame.style, { height: '100%', overflow: 'hidden', position: 'relative', width: '100%' });
    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, { display: 'block', height: '100%', width: '100%' });
    frame.append(canvas);
    renderTo.append(frame);

    const view = new View({
        camera: { position: [0, 52, 20], target: [0, -4, 0] }, // Looking almost straight down, so the far side of each ring is not squeezed behind the near side.
        canvas,
        description: 'Network diagram. Use the arrow keys to step through the nodes, and Enter to open one.',
        highlight: COLOR.highlight,
        keyboard: { label: (hit: Hit) => constructLabel((hit.datum as DiagramRow | undefined)?.node) },
        orbit: true
    });
    const { scene } = view;
    scene.environment = 'studio';

    // Nodes ─ When labels collide, the node higher in the hierarchy keeps its label.
    scene.add(
        new InstancedMesh({
            data: rows,
            geometry: icosphere({ detail: 2, radius: 1 }),
            instances: rows.map((row) => ({ color: getLevelStyle(row.node).color, position: row.position, scale: getLevelStyle(row.node).radius })),
            labels: {
                className: LABEL_CLASS_NAME,
                occlude: true,
                overlap: 'hide', // Zooming in or turning the diagram brings a hidden label back.
                place: 'below',
                priority: (row: DiagramRow) => LEVEL_STYLES.length - getLevel(row.node),
                text: (row: DiagramRow) => constructLabel(row.node)
            },
            material: { roughness: 0.4 }
        })
    );

    // Links ─ Not pickable, so the arrow keys step through the nodes only.
    const linkPositions = links.flatMap(([a, b]) => [...rowAt(rows, a).position, ...rowAt(rows, b).position]);
    scene.add(new Lines({ geometry: new Geometry({ positions: linkPositions }), material: { color: COLOR.link, width: 1.5 }, pickable: false }));

    view.on('click', (hit) => {
        const row = hit?.datum as DiagramRow | undefined;
        if (row) options.onNodeClick?.(row.node); // The caller's own node, without the layout's positions.
    });

    view.frame(scene, { padding: 0.08 });
    view.start(); // Keeps drawing, so orbiting and the keyboard's highlight show as they happen.

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

// Links name nodes by id, but phoria2 hands back rows by position, so both become indexes into one row list. Each
// link is read as running from parent to child. A node reached by several links keeps the first as its parent, so the
// layout is always a tree, while every link is still drawn.
function constructRows(data: NetworkDiagramData): { links: [number, number][]; rows: DiagramRow[] } {
    const rows: DiagramRow[] = data.nodes.map((node, index) => ({ childIndexes: [], depth: 0, index, leafCount: 1, node, position: [0, 0, 0] }));
    const indexById = new Map(rows.map((row) => [row.node.id, row.index]));
    const links: [number, number][] = [];
    const targetIndexesBySourceIndex = new Map<number, number[]>();
    const linkedTargetIndexes = new Set<number>();
    for (const link of data.links) {
        const a = indexById.get(link.source);
        const b = indexById.get(link.target);
        if (a === undefined || b === undefined) continue; // A link to a node that is not in the data has nothing to join.
        links.push([a, b]);
        targetIndexesBySourceIndex.set(a, [...(targetIndexesBySourceIndex.get(a) ?? []), b]);
        linkedTargetIndexes.add(b);
    }

    // The tops of the trees are the nodes no link runs to. Nodes left over belong to a loop with no top, so the first
    // of them becomes one, until every node is placed.
    const rootIndexes: number[] = [];
    const visitedIndexes = new Set<number>();
    const visitTree = (rootIndex: number): void => {
        rootIndexes.push(rootIndex);
        visitedIndexes.add(rootIndex);
        const queue = [rootIndex];
        let parentIndex = queue.shift();
        while (parentIndex !== undefined) {
            const targetIndexes = targetIndexesBySourceIndex.get(parentIndex) ?? [];
            for (const childIndex of targetIndexes) {
                if (visitedIndexes.has(childIndex)) continue;
                visitedIndexes.add(childIndex);
                rowAt(rows, parentIndex).childIndexes.push(childIndex);
                queue.push(childIndex);
            }
            parentIndex = queue.shift();
        }
    };
    for (const row of rows) if (!linkedTargetIndexes.has(row.index)) visitTree(row.index);
    for (const row of rows) if (!visitedIndexes.has(row.index)) visitTree(row.index);

    // A single top sits in the middle. Several share the first ring, as if below a top that is not drawn.
    const topDepth = rootIndexes.length === 1 ? 0 : 1;
    for (const rootIndex of rootIndexes) countLeaves(rows, rootIndex);
    placeSiblings(rows, rootIndexes, topDepth, 0, Math.PI * 2);
    return { links, rows };
}

function countLeaves(rows: DiagramRow[], index: number): number {
    const row = rowAt(rows, index);
    if (row.childIndexes.length > 0) row.leafCount = row.childIndexes.reduce((count, childIndex) => count + countLeaves(rows, childIndex), 0);
    return row.leafCount;
}

// Shares an arc of the ring among siblings by how many leaves each has below it, so a node with many descendants gets
// the room they need. Each node sits in the middle of its share, and its children divide that share on the next ring.
function placeSiblings(rows: DiagramRow[], indexes: number[], depth: number, fromAngle: number, toAngle: number): void {
    const totalLeafCount = indexes.reduce((count, index) => count + rowAt(rows, index).leafCount, 0);
    let angle = fromAngle;
    for (const index of indexes) {
        const row = rowAt(rows, index);
        const share = ((toAngle - fromAngle) * row.leafCount) / totalLeafCount;
        const middleAngle = angle + share / 2;
        const radius = depth * RING_GAP;
        row.depth = depth;
        row.position = [Math.cos(middleAngle) * radius, -depth * TIER_GAP, Math.sin(middleAngle) * radius];
        placeSiblings(rows, row.childIndexes, depth + 1, angle, angle + share);
        angle += share;
    }
}

function constructLabel(node: NetworkDiagramNode | undefined): string {
    return node?.label ?? node?.id ?? '';
}

function getLevel(node: NetworkDiagramNode): number {
    return Math.max(0, Math.min(node.level ?? DEFAULT_LEVEL, LEVEL_STYLES.length - 1));
}

function getLevelStyle(node: NetworkDiagramNode): (typeof LEVEL_STYLES)[number] {
    const style = LEVEL_STYLES[getLevel(node)];
    if (!style) throw new Error('No network diagram style for the level.');
    return style;
}

function ensureStyle(): void {
    if (document.querySelector(`#${STYLE_ELEMENT_ID}`)) return;
    const style = document.createElement('style');
    style.id = STYLE_ELEMENT_ID;
    style.textContent = STYLE;
    document.head.append(style);
}

function rowAt(rows: DiagramRow[], index: number): DiagramRow {
    const row = rows[index];
    if (!row) throw new Error(`No network diagram row at index ${String(index)}.`);
    return row;
}
