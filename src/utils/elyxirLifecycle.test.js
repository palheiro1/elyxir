import {
    getJobLifecycle,
    getLifecycleTimeline,
    getOutcomeCopy,
    shouldShowCatastropheHeight,
} from './elyxirLifecycle';

describe('elyxirLifecycle', () => {
    it('uses the new lifecycle only when escrowed is true', () => {
        expect(getJobLifecycle({ escrowed: true })).toBe('new');
        expect(getJobLifecycle({ escrowed: false })).toBe('legacy');
        expect(getJobLifecycle({})).toBe('legacy');
    });

    it('builds the escrow timeline for new lifecycle jobs', () => {
        const timeline = getLifecycleTimeline(
            {
                escrowed: true,
                status: 'STARTED',
                startHeight: 4472500,
                endHeight: 4473940,
            },
            4472600
        );

        expect(timeline.map(step => step.label)).toEqual([
            'Submitted',
            'Assets locked',
            'Alchemy in progress',
            'Resolution at block 4473940',
        ]);
    });

    it('keeps missing escrowed jobs in legacy lifecycle', () => {
        const timeline = getLifecycleTimeline(
            {
                status: 'STARTED',
                isSuccess: true,
                startHeight: 4471107,
                endHeight: 4472547,
            },
            4472135
        );

        expect(timeline[1].description).toContain('tools returned immediately');
        expect(getOutcomeCopy({ status: 'FINALIZED', isSuccess: true })).toBe('Potion completed.');
    });

    it('only exposes catastrophe height after catastrophe is known', () => {
        expect(
            shouldShowCatastropheHeight({
                escrowed: true,
                status: 'STARTED',
                catastropheHeight: 4473000,
            })
        ).toBe(false);

        expect(
            shouldShowCatastropheHeight({
                escrowed: true,
                status: 'CATASTROPHIC',
                catastropheHeight: 4473000,
            })
        ).toBe(true);
    });
});
