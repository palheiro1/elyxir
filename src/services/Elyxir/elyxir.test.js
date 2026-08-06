import axios from 'axios';
import { sendMessage, transferAsset } from '../Ardor/ardorInterface';
import {
    getElyxirConfiguration,
    sendCraftPotionAssets,
    sendCraftPotionMessage,
} from './elyxir';

jest.mock('axios', () => ({
    get: jest.fn(),
}));

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'client-job-id'),
}));

jest.mock('../Ardor/ardorInterface', () => ({
    sendMessage: jest.fn(),
    transferAsset: jest.fn(),
}));

describe('Elyxir service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('cache-busts Elyxir state reads', async () => {
        jest.spyOn(Date, 'now').mockReturnValue(123456789);
        axios.get.mockResolvedValue({ data: { elyxir: { jobs: {} } } });

        await expect(getElyxirConfiguration()).resolves.toEqual({ jobs: {} });
        expect(axios.get).toHaveBeenCalledWith('https://api.mythicalbeings.io/index.php?action=getElyxirState', {
            params: { _: 123456789 },
        });
    });

    it('submits real crafting messages with test mode disabled', async () => {
        sendMessage.mockResolvedValue({ fullHash: 'create-full-hash' });

        await sendCraftPotionMessage({
            accountId: 'account-id',
            recipeAssetId: 'recipe-id',
            creationAssetId: 'potion-id',
            flaskAssetId: 'flask-id',
            durationBlocks: 1440,
            passphrase: 'secret phrase',
            blockId: 4609363,
        });

        const request = sendMessage.mock.calls[0][0];
        const parameter = JSON.parse(request.message).operation[0].parameter;

        expect(parameter).toEqual(
            expect.objectContaining({
                owner: 'account-id',
                testMode: false,
            })
        );
    });

    it('reports progress after every direct asset transfer', async () => {
        transferAsset.mockResolvedValue({ fullHash: 'asset-full-hash' });
        const onProgress = jest.fn();

        await expect(
            sendCraftPotionAssets({
                mergedAssets: [
                    { asset: 'flask-id', qnt: 1 },
                    { asset: 'tool-id', qnt: 1 },
                ],
                passphrase: 'secret phrase',
                onProgress,
            })
        ).resolves.toBe(true);

        expect(onProgress.mock.calls.map(([progress]) => progress)).toEqual([
            { status: 'transferring', completed: 0, total: 2, remaining: 2 },
            { status: 'transferring', completed: 1, total: 2, remaining: 1 },
            { status: 'transferring', completed: 2, total: 2, remaining: 0 },
        ]);
    });
});
