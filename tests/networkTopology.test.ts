// @vitest-environment happy-dom

// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local
import { renderNetworkTopology } from '@/networkTopology';
import { type NetworkTopologyData, Tool as Phoria2Tool } from '@/index';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// happy-dom has no WebGL, so phoria2 is replaced by stand-ins that record what the renderer builds.
const created = vi.hoisted(() => ({
    drawables: [] as { kind: string; options: Record<string, unknown> }[],
    views: [] as {
        disposeCount: number;
        frameFunction?: (dt: number) => void;
        handlers: Record<string, (hit: unknown) => void>;
        options: Record<string, unknown>;
    }[]
}));

vi.mock('phoria2', () => {
    class Geometry {
        drawCount: number | null = null;
        needsUpdateCount = 0;
        positions: Float32Array;
        constructor(options: { positions: ArrayLike<number> }) {
            this.positions = options.positions instanceof Float32Array ? options.positions : new Float32Array(options.positions);
        }
        needsUpdate(): this {
            this.needsUpdateCount++;
            return this;
        }
    }
    function createDrawableClass(kind: string) {
        return class {
            geometry: unknown;
            material: { dashOffset: number };
            visible = true;
            constructor(options: Record<string, unknown>) {
                this.geometry = options['geometry'];
                this.material = { dashOffset: 0 };
                created.drawables.push({ kind, options });
            }
        };
    }
    class View {
        readonly record: (typeof created.views)[number];
        readonly scene = { add: <T>(node: T): T => node, environment: '' };
        constructor(options: Record<string, unknown>) {
            this.record = { disposeCount: 0, handlers: {}, options };
            created.views.push(this.record);
        }
        dispose(): void {
            this.record.disposeCount++;
        }
        frame(): void {
            /* Framing needs a real camera. */
        }
        on(type: string, handler: (hit: unknown) => void): () => void {
            this.record.handlers[type] = handler;
            return () => {
                /* Nothing to remove. */
            };
        }
        render(): void {
            /* Drawing needs WebGL. */
        }
        resize(): void {
            /* Sizing needs a real canvas. */
        }
        start(frameFunction: (dt: number) => void): this {
            this.record.frameFunction = frameFunction;
            return this;
        }
    }
    return {
        box: () => ({}),
        Geometry,
        icosphere: () => ({}),
        InstancedMesh: createDrawableClass('instancedMesh'),
        Lines: createDrawableClass('lines'),
        Points: createDrawableClass('points'),
        View
    };
});

// ── Data ─────────────────────────────────────────────────────────────────────────────────────────────────────────────

const data: NetworkTopologyData = {
    links: [
        { source: 'core', target: 'dist' },
        { source: 'dist', target: 'app' },
        { source: 'dist', target: 'db' },
        { source: 'dist', target: 'missing' }
    ],
    nodes: [
        { address: 'core-1.example.net', id: 'core', label: 'core-1', load: 40, position: [0, 6, 0], statusId: 'healthy', typeId: 'router' },
        { address: 'dist-1.example.net', id: 'dist', label: 'dist-1', load: 60, position: [7, 3, 0], statusId: 'degraded', typeId: 'switch' },
        { address: 'app-1a.example.net', id: 'app', label: 'app-1a', load: 30, position: [13, 0, 0], statusId: 'healthy', typeId: 'server' },
        { address: 'db-1a.example.net', id: 'db', label: 'db-1a', load: 0, position: [13, 0, 2], statusId: 'down', typeId: 'database' }
    ]
};

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

function lastView(): (typeof created.views)[number] {
    const view = created.views.at(-1);
    if (!view) throw new Error('No view was created.');
    return view;
}

function render(options?: Parameters<typeof renderNetworkTopology>[2]): { handle: ReturnType<typeof renderNetworkTopology>; renderTo: HTMLDivElement } {
    const renderTo = document.createElement('div');
    document.body.append(renderTo);
    const handle = renderNetworkTopology(data, renderTo, options);
    return { handle, renderTo };
}

function rowFor(id: string): unknown {
    const meshes = created.drawables.filter((drawable) => drawable.kind === 'instancedMesh');
    for (const mesh of meshes) {
        const row = (mesh.options['data'] as { id: string }[]).find((candidate) => candidate.id === id);
        if (row) return row;
    }
    throw new Error(`No row for '${id}'.`);
}

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
    created.drawables.length = 0;
    created.views.length = 0;
});

describe('renderNetworkTopology', () => {
    it('renders a canvas, a legend and a summary of the problems', () => {
        const { handle, renderTo } = render();

        expect(renderTo.querySelector('canvas')).toBe(handle.canvas);
        expect(renderTo.textContent).toContain('Status');
        expect(renderTo.textContent).toContain('Degraded');
        expect(renderTo.querySelector('[aria-live="polite"]')?.textContent).toBe('4 nodes: 1 down, 1 degraded. Hover to trace links.');
    });

    it('draws hubs and hosts as separate instanced meshes', () => {
        render();

        const meshes = created.drawables.filter((drawable) => drawable.kind === 'instancedMesh');
        const ids = meshes.map((mesh) => (mesh.options['data'] as { id: string }[]).map((row) => row.id));
        expect(ids).toEqual([
            ['core', 'dist'],
            ['app', 'db']
        ]);
    });

    it('skips links to nodes that are not in the data', () => {
        render();

        const tooltip = lastView().options['tooltip'] as (hit: unknown) => { rows: Record<string, unknown> } | null;
        expect(tooltip({ datum: rowFor('dist') })?.rows['Links']).toBe(3);
    });

    it('describes the node under the pointer in the tooltip', () => {
        render();

        const tooltip = lastView().options['tooltip'] as (hit: unknown) => unknown;
        expect(tooltip({ datum: rowFor('db') })).toEqual({
            rows: { Address: 'db-1a.example.net', Links: 1, Load: '0%', Status: 'Down', Type: 'Database' },
            title: 'db-1a'
        });
        expect(tooltip({ datum: undefined })).toBeNull();
    });

    it("draws the hovered node's links and clears them when the pointer leaves", () => {
        render();

        const hoveredLines = created.drawables.find((drawable) => drawable.kind === 'lines' && drawable.options['arrows'] === 'end');
        const geometry = hoveredLines?.options['geometry'] as { drawCount: number | null };
        expect(geometry.drawCount).toBe(0);

        lastView().handlers['hover']?.({ datum: rowFor('dist') });
        expect(geometry.drawCount).toBe(6);

        lastView().handlers['hover']?.(null);
        expect(geometry.drawCount).toBe(0);
    });

    it('shows a clicked node in the summary and restores the summary on an empty click', () => {
        const { renderTo } = render();
        const summary = renderTo.querySelector('[aria-live="polite"]');

        lastView().handlers['click']?.({ datum: rowFor('app') });
        expect(summary?.textContent).toBe('app-1a: healthy, 30% load, 1 links');

        lastView().handlers['click']?.(null);
        expect(summary?.textContent).toBe('4 nodes: 1 down, 1 degraded. Hover to trace links.');
    });

    it('hides healthy host labels when only problems are labelled', () => {
        render({ labelsShowOnlyProblems: true });

        const hostMesh = created.drawables.filter((drawable) => drawable.kind === 'instancedMesh')[1];
        const text = (hostMesh?.options['labels'] as { text: (row: unknown) => string | null }).text;
        expect(text(rowFor('app'))).toBeNull();
        expect(text(rowFor('db'))).toBe('db-1a');
    });

    it('moves packets along live links only, and not when traffic is hidden', () => {
        render();
        const packets = created.drawables.find((drawable) => drawable.kind === 'points');
        const geometry = packets?.options['geometry'] as { needsUpdateCount: number; positions: Float32Array };
        expect(geometry.positions).toHaveLength(2 * 3); // The link to the 'down' database carries no traffic.

        lastView().frameFunction?.(0.5);
        expect(geometry.needsUpdateCount).toBe(1);

        render({ trafficIsShown: false });
        const hiddenPackets = created.drawables.findLast((drawable) => drawable.kind === 'points');
        const hiddenGeometry = hiddenPackets?.options['geometry'] as { needsUpdateCount: number };
        lastView().frameFunction?.(0.5);
        expect(hiddenGeometry.needsUpdateCount).toBe(0);
    });

    it('frees the view and removes its elements when destroyed', () => {
        const { handle, renderTo } = render();

        handle.destroy();

        expect(lastView().disposeCount).toBe(1);
        expect(renderTo.childElementCount).toBe(0);
    });
});

describe('Phoria2Tool.renderNetworkTopology', () => {
    it('returns a phoria2 view and invokes the callback once rendered', async () => {
        const renderTo = document.createElement('div');
        let isCalled = false;

        const view = await new Phoria2Tool().renderNetworkTopology(data, renderTo, undefined, () => {
            isCalled = true;
        });

        expect(view.vendorId).toBe('phoria2');
        expect(view.canvas.tagName.toLowerCase()).toBe('canvas');
        expect(isCalled).toBe(true);
        expect(() => {
            view.resize();
        }).not.toThrow();
    });
});
