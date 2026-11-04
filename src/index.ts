// ── DPUse Framework
import type { PresentationView } from '@dpuse/dpuse-shared';

// ── Local Framework
import type { NetworkTopologyData, NetworkTopologyOptions } from '@/networkTopology';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

export type { NetworkTopologyData, NetworkTopologyLink, NetworkTopologyNode, NetworkTopologyNodeTypeId, NetworkTopologyOptions, NetworkTopologyPosition, NetworkTopologyStatusId } from '@/networkTopology';

// Each view holds a WebGL context until 'destroy' is called, and browsers allow only about 16 per page.
export interface Phoria2View extends PresentationView {
    canvas: HTMLCanvasElement;
    destroy: () => void;
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const PHORIA2_ID = 'phoria2';

// ── Tools ────────────────────────────────────────────────────────────────────────────────────────────────────────────

export class Tool {
    // Actions - Render network topology.
    async renderNetworkTopology(data: NetworkTopologyData, renderTo: HTMLElement, options?: NetworkTopologyOptions, callback?: () => void): Promise<Phoria2View> {
        const { renderNetworkTopology } = await import('@/networkTopology');
        const handle = renderNetworkTopology(data, renderTo, options);
        callback?.();
        return { canvas: handle.canvas, destroy: handle.destroy, resize: handle.resize, vendorId: PHORIA2_ID };
    }
}
