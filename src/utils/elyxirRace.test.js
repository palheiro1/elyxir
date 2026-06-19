import {
    BLOCKS_PER_DAY,
    RACE_START_ARDOR_TIMESTAMP,
    RACE_START_DATE,
    blocksToDurationLabel,
    buildRacePotionStatuses,
    buildRaceLeaderboard,
    clampDurationBlocks,
    getDurationBounds,
    getDurationPresets,
} from './elyxirRace';

describe('elyxir race time helpers', () => {
    it('uses Omno duration bounds and clamps to minute/block granularity', () => {
        const bounds = getDurationBounds({ minDurationBlocks: '1440', maxDurationBlocks: '43200' });

        expect(bounds).toEqual({ min: 1440, max: 43200 });
        expect(clampDurationBlocks(1000, bounds)).toBe(1440);
        expect(clampDurationBlocks(1441.2, bounds)).toBe(1441);
        expect(clampDurationBlocks(999999, bounds)).toBe(43200);
        expect(blocksToDurationLabel(BLOCKS_PER_DAY)).toBe('1d');
        expect(blocksToDurationLabel(BLOCKS_PER_DAY * 2 + 60)).toBe('2d 1h');
    });

    it('keeps quick presets as shortcuts without forcing a discrete duration list', () => {
        const presets = getDurationPresets({ min: 1440, max: 43200 });

        expect(presets.map(preset => preset.blocks)).toEqual([1440, 2880, 7200, 14400, 43200]);
    });
});

describe('buildRaceLeaderboard', () => {
    it('selects the first successful delivery after the official start per potion', () => {
        const jobs = [
            {
                jobId: 'before-start',
                creationAssetId: 'potion-a',
                owner: 'before',
                status: 'FINALIZED',
                isSuccess: true,
                resolvedHeight: 10,
            },
            {
                jobId: 'failed-after-start',
                creationAssetId: 'potion-a',
                owner: 'failed',
                status: 'FINALIZED',
                isSuccess: false,
                resolvedHeight: 20,
            },
            {
                jobId: 'undelivered-after-start',
                creationAssetId: 'potion-a',
                owner: 'undelivered',
                status: 'FINALIZED',
                isSuccess: true,
                resolvedHeight: 30,
                creationDelivered: false,
            },
            {
                jobId: 'play-hub-winner',
                creationAssetId: 'potion-a',
                owner: 'winner',
                status: 'FINALIZED',
                resolvedStatus: 'FINALIZED',
                creationDelivered: true,
                testMode: true,
                resolvedHeight: 40,
            },
            {
                jobId: 'test-mode-without-delivery-flag',
                creationAssetId: 'potion-a',
                owner: 'test',
                status: 'FINALIZED',
                resolvedStatus: 'FINALIZED',
                testMode: true,
                resolvedHeight: 35,
            },
            {
                jobId: 'later',
                creationAssetId: 'potion-a',
                owner: 'later',
                status: 'FINALIZED',
                isSuccess: true,
                resolvedHeight: 50,
            },
            {
                jobId: 'latest',
                creationAssetId: 'potion-a',
                owner: 'latest',
                status: 'FINALIZED',
                isSuccess: true,
                resolvedHeight: 60,
            },
            {
                jobId: 'height-fallback',
                creationAssetId: 'potion-b',
                owner: 'fallback',
                status: 'FINALIZED',
                isSuccess: true,
                resolvedHeight: 1001,
            },
        ];
        const blockTimestamps = {
            10: RACE_START_ARDOR_TIMESTAMP - 1,
            20: RACE_START_ARDOR_TIMESTAMP + 10,
            30: RACE_START_ARDOR_TIMESTAMP + 20,
            35: RACE_START_ARDOR_TIMESTAMP + 25,
            40: RACE_START_ARDOR_TIMESTAMP + 30,
            50: RACE_START_ARDOR_TIMESTAMP + 60,
            60: RACE_START_ARDOR_TIMESTAMP + 90,
        };

        const leaderboard = buildRaceLeaderboard({
            jobs,
            potions: [
                { asset: 'potion-a', name: 'A Potion' },
                { asset: 'potion-b', name: 'B Potion' },
            ],
            blockTimestamps,
            currentHeight: 1005,
            now: new Date(RACE_START_DATE.getTime() + 5 * 60 * 1000),
        });

        expect(leaderboard).toHaveLength(2);
        expect(leaderboard.find(entry => entry.creationAssetId === 'potion-a').jobId).toBe('play-hub-winner');
        expect(leaderboard.find(entry => entry.creationAssetId === 'potion-b').jobId).toBe('height-fallback');
    });

    it('builds delivered and still-eligible reward rows for every race potion', () => {
        const statuses = buildRacePotionStatuses({
            recipes: [
                { creationAssetId: 'potion-a', recipeAssetId: 'recipe-a' },
                { creationAssetId: 'potion-b', recipeAssetId: 'recipe-b' },
            ],
            potions: [
                { asset: 'potion-a', name: 'A Potion' },
                { asset: 'potion-b', name: 'B Potion' },
            ],
            leaderboard: [
                {
                    creationAssetId: 'potion-a',
                    jobId: 'winner',
                    potion: { asset: 'potion-a', name: 'A Potion' },
                },
            ],
        });

        expect(statuses).toHaveLength(2);
        expect(statuses[0]).toMatchObject({
            creationAssetId: 'potion-a',
            isDelivered: true,
            rewardAsset: 'GIFTZ',
            rewardQuantity: 1,
        });
        expect(statuses[1]).toMatchObject({
            creationAssetId: 'potion-b',
            isDelivered: false,
            rewardAsset: 'GIFTZ',
            rewardQuantity: 1,
        });
    });
});
