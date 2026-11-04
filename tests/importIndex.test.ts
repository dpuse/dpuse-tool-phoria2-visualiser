// @vitest-environment happy-dom

// ── External Dependencies & Registrations
import { describe, expect, it } from 'vitest';

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

describe('index', () => {
    it('imports without throwing', async () => {
        await expect(import('@/index')).resolves.toBeDefined();
    });
});
