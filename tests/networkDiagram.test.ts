// @vitest-environment happy-dom

// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local
import { renderNetworkDiagram } from '@/networkDiagram';
import { type NetworkDiagramData, type NetworkDiagramNode, Tool as Phoria2Tool } from '@/index';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface Instance {
    color: string;
    position: [number, number, number];
    scale: number;
}

interface Row {
    node: NetworkDiagramNode;
}

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// happy-dom has no WebGL, so phoria2 is replaced by stand-ins that record what the renderer builds.
const created = vi.hoisted(() => ({
    drawables: [] as { kind: string; options: Record<string, unknown> }[],
    views: [] as { disposeCount: number; handlers: Record<string, (hit: unknown) => void>; isStarted: boolean; options: Record<string, unknown> }[]
}));

vi.mock('phoria2', () => {
    class Geometry {
        positions: Float32Array;
        constructor(options: { positions: ArrayLike<number> }) {
            this.positions = new Float32Array(options.positions);
        }
    }
    function createDrawableClass(kind: string) {
        return class {
            readonly kind = kind;
            constructor(options: Record<string, unknown>) {
                created.drawables.push({ kind, options });
            }
        };
    }
    class View {
        readonly record: (typeof created.views)[number];
        readonly scene = { add: <T>(node: T): T => node, environment: '' };
        constructor(options: Record<string, unknown>) {
            this.record = { disposeCount: 0, handlers: {}, isStarted: false, options };
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
        start(): this {
            this.record.isStarted = true;
            return this;
        }
    }
    return { Geometry, icosphere: () => ({}), InstancedMesh: createDrawableClass('instancedMesh'), Lines: createDrawableClass('lines'), View };
});

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

// One area with three models and one with a single model, so the areas' shares of the ring differ.
const data: NetworkDiagramData = {
    links: [
        { source: 'context', target: 'hr' },
        { source: 'context', target: 'finance' },
        { source: 'hr', target: 'workforce' },
        { source: 'hr', target: 'learning' },
        { source: 'hr', target: 'attendance' },
        { source: 'finance', target: 'ledger' },
        { source: 'finance', target: 'missing' }
    ],
    nodes: [
        { id: 'context', label: 'Context', level: 0 },
        { id: 'hr', label: 'Human Resource', level: 1 },
        { id: 'finance', label: 'Finance', level: 1 },
        { id: 'workforce', label: 'Workforce', level: 2 },
        { id: 'learning', label: 'Learning', level: 2 },
        { id: 'attendance', label: 'Attendance', level: 2 },
        { id: 'ledger', level: 2 }
    ]
};

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
    created.drawables.length = 0;
    created.views.length = 0;
});

describe('renderNetworkDiagram', () => {
    describe('layout', () => {
        it('puts the top node in the middle, and each deeper level on a wider ring one tier lower', () => {
            render();

            const topY = positionOf('context')[1];
            expect(distanceFromMiddle('context')).toBe(0);
            expect(topY).toBeCloseTo(0);
            expect(distanceFromMiddle('hr')).toBeCloseTo(distanceFromMiddle('finance'));
            expect(distanceFromMiddle('workforce')).toBeCloseTo(distanceFromMiddle('hr') * 2);
            expect(positionOf('hr')[1]).toBeLessThan(topY);
            expect(positionOf('workforce')[1]).toBeLessThan(positionOf('hr')[1]);
        });

        it('gives a node with more descendants a larger share of the ring, and keeps its children inside that share', () => {
            render();

            // Human Resource has three of the four leaves, so its share is three quarters of the circle from the start.
            expect(angleOf('hr')).toBeCloseTo((Math.PI * 2 * 0.75) / 2);
            for (const modelId of ['workforce', 'learning', 'attendance']) expect(angleOf(modelId)).toBeLessThan(Math.PI * 2 * 0.75);
            expect(angleOf('ledger')).toBeGreaterThan(Math.PI * 2 * 0.75);
        });

        it('shares the first ring among several top nodes', () => {
            render({ links: [], nodes: [{ id: 'a' }, { id: 'b' }] });

            expect(distanceFromMiddle('a')).toBeGreaterThan(0);
            expect(distanceFromMiddle('a')).toBeCloseTo(distanceFromMiddle('b'));
            expect(angleOf('a')).not.toBeCloseTo(angleOf('b'));
        });

        it('places every node of a loop that has no top', () => {
            render({
                links: [
                    { source: 'a', target: 'b' },
                    { source: 'b', target: 'a' }
                ],
                nodes: [{ id: 'a' }, { id: 'b' }]
            });

            expect(distanceFromMiddle('a')).toBe(0);
            expect(distanceFromMiddle('b')).toBeGreaterThan(0);
        });
    });

    describe('drawing', () => {
        it('renders a canvas on a transparent background, so the page’s theme shows through', () => {
            const { handle, renderTo } = render();

            expect(renderTo.querySelector('canvas')).toBe(handle.canvas);
            expect(lastView().options['background']).toBeUndefined();
            expect(lastView().isStarted).toBe(true);
        });

        it('sizes and colours each node by its level, and a node with no level as level 1', () => {
            render({ links: [], nodes: [{ id: 'top', level: 0 }, { id: 'plain' }, { id: 'area', level: 1 }, { id: 'deep', level: 99 }] });

            const [top, plain, area, deep] = instances();
            expect(top?.scale).toBeGreaterThan(area?.scale ?? 0);
            expect(plain).toMatchObject({ color: area?.color, scale: area?.scale });
            expect(deep?.scale).toBeLessThan(area?.scale ?? 0);
        });

        it('labels a node with its label, or its id when it has none', () => {
            render();

            const labels = mesh().options['labels'] as { text: (row: Row) => string };
            expect(rows().map((row) => labels.text(row))).toStrictEqual(['Context', 'Human Resource', 'Finance', 'Workforce', 'Learning', 'Attendance', 'ledger']);
        });

        it('draws one line per link, skipping a link to a node that is not in the data', () => {
            render();

            const lines = created.drawables.find((drawable) => drawable.kind === 'lines');
            const geometry = lines?.options['geometry'] as { positions: Float32Array };
            expect(geometry.positions).toHaveLength(6 * 6); // Six links, each with two ends of three coordinates.
            expect(lines?.options['pickable']).toBe(false);
        });
    });

    describe('interaction', () => {
        it('passes the clicked node, as the caller gave it, to onNodeClick', () => {
            const clickedNodes: NetworkDiagramNode[] = [];
            render(data, (node) => {
                clickedNodes.push(node);
            });

            lastView().handlers['click']?.({ datum: rows()[1] });
            lastView().handlers['click']?.(null); // Empty space.

            expect(clickedNodes).toStrictEqual([data.nodes[1]]);
        });

        it('lets the keyboard step through the nodes, reading each one’s label', () => {
            render();

            const keyboard = lastView().options['keyboard'] as { label: (hit: unknown) => string };
            expect(keyboard.label({ datum: rows()[1] })).toBe('Human Resource');
        });

        it('destroy() disposes the view and removes everything it added', () => {
            const { handle, renderTo } = render();

            handle.destroy();

            expect(lastView().disposeCount).toBe(1);
            expect(renderTo.children).toHaveLength(0);
        });
    });
});

describe('Phoria2Tool.renderNetworkDiagram', () => {
    it('returns a phoria2 view and invokes the callback once drawn', async () => {
        const renderTo = document.createElement('div');
        let isCalled = false;

        const view = await new Phoria2Tool().renderNetworkDiagram(data, renderTo, undefined, () => {
            isCalled = true;
        });

        expect(view.vendorId).toBe('phoria2');
        expect(view.canvas.tagName.toLowerCase()).toBe('canvas');
        expect(isCalled).toBe(true);
    });
});

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

function render(
    diagramData: NetworkDiagramData = data,
    onNodeClick?: (node: NetworkDiagramNode) => void
): { handle: ReturnType<typeof renderNetworkDiagram>; renderTo: HTMLElement } {
    const renderTo = document.createElement('div');
    const handle = renderNetworkDiagram(diagramData, renderTo, onNodeClick ? { onNodeClick } : {});
    return { handle, renderTo };
}

function lastView(): (typeof created.views)[number] {
    const view = created.views.at(-1);
    if (!view) throw new Error('No view was created.');
    return view;
}

function mesh(): (typeof created.drawables)[number] {
    const drawable = created.drawables.find((candidate) => candidate.kind === 'instancedMesh');
    if (!drawable) throw new Error('No instanced mesh was created.');
    return drawable;
}

function rows(): Row[] {
    return mesh().options['data'] as Row[];
}

function instances(): Instance[] {
    return mesh().options['instances'] as Instance[];
}

function positionOf(nodeId: string): [number, number, number] {
    const instance = instances()[rows().findIndex((row) => row.node.id === nodeId)];
    if (!instance) throw new Error(`No node '${nodeId}' was drawn.`);
    return instance.position;
}

function distanceFromMiddle(nodeId: string): number {
    const [x, , z] = positionOf(nodeId);
    return Math.hypot(x, z);
}

// The angle round the ring, from 0 up to a full turn.
function angleOf(nodeId: string): number {
    const [x, , z] = positionOf(nodeId);
    return (Math.atan2(z, x) + Math.PI * 2) % (Math.PI * 2);
}
