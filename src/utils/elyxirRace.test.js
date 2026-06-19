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
    it('selects the first successful post-start brew and delivery per potion', () => {
        const jobs = [
            {
                jobId: 'before-start',
                creationAssetId: 'potion-a',
                owner: 'before',
                status: 'FINALIZED',
                isSuccess: true,
                startHeight: 5,
                resolvedHeight: 10,
            },
            {
                jobId: 'failed-after-start',
                creationAssetId: 'potion-a',
                owner: 'failed',
                status: 'FINALIZED',
                isSuccess: false,
                startHeight: 15,
                resolvedHeight: 20,
            },
            {
                jobId: 'undelivered-after-start',
                creationAssetId: 'potion-a',
                owner: 'undelivered',
                status: 'FINALIZED',
                isSuccess: true,
                startHeight: 25,
                resolvedHeight: 30,
                creationDelivered: false,
            },
            {
                jobId: 'started-before-resolved-after',
                creationAssetId: 'potion-a',
                owner: 'early-start',
                status: 'FINALIZED',
                isSuccess: true,
                startHeight: 28,
                resolvedHeight: 32,
            },
            {
                jobId: 'play-hub-winner',
                creationAssetId: 'potion-a',
                owner: 'winner',
                status: 'FINALIZED',
                resolvedStatus: 'FINALIZED',
                creationDelivered: true,
                testMode: true,
                startHeight: 38,
                resolvedHeight: 40,
            },
            {
                jobId: 'test-mode-without-delivery-flag',
                creationAssetId: 'potion-a',
                owner: 'test',
                status: 'FINALIZED',
                resolvedStatus: 'FINALIZED',
                testMode: true,
                startHeight: 34,
                resolvedHeight: 35,
            },
            {
                jobId: 'later',
                creationAssetId: 'potion-a',
                owner: 'later',
                status: 'FINALIZED',
                isSuccess: true,
                startHeight: 45,
                resolvedHeight: 50,
            },
            {
                jobId: 'latest',
                creationAssetId: 'potion-a',
                owner: 'latest',
                status: 'FINALIZED',
                isSuccess: true,
                startHeight: 55,
                resolvedHeight: 60,
            },
            {
                jobId: 'height-fallback',
                creationAssetId: 'potion-b',
                owner: 'fallback',
                status: 'FINALIZED',
                isSuccess: true,
                startHeight: 1000,
                resolvedHeight: 1001,
            },
        ];
        const blockTimestamps = {
            5: RACE_START_ARDOR_TIMESTAMP - 10,
            10: RACE_START_ARDOR_TIMESTAMP - 1,
            15: RACE_START_ARDOR_TIMESTAMP + 5,
            20: RACE_START_ARDOR_TIMESTAMP + 10,
            25: RACE_START_ARDOR_TIMESTAMP + 15,
            28: RACE_START_ARDOR_TIMESTAMP - 5,
            30: RACE_START_ARDOR_TIMESTAMP + 20,
            32: RACE_START_ARDOR_TIMESTAMP + 22,
            34: RACE_START_ARDOR_TIMESTAMP + 24,
            35: RACE_START_ARDOR_TIMESTAMP + 25,
            38: RACE_START_ARDOR_TIMESTAMP + 28,
            40: RACE_START_ARDOR_TIMESTAMP + 30,
            45: RACE_START_ARDOR_TIMESTAMP + 45,
            50: RACE_START_ARDOR_TIMESTAMP + 60,
            55: RACE_START_ARDOR_TIMESTAMP + 75,
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
