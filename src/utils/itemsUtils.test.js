import {
    getAskOrders,
    getAsset,
    getBidOrders,
    getLastTrades,
} from '../services/Ardor/ardorInterface';
import { getOmnoMarketOrdesForAsset } from '../services/Ardor/omnoInterface';
import { getFlaskAssets } from '../services/Elyxir/elyxir';
import { getItemsForBonus, getOmnoItemsBalance } from '../services/Items/Items';
import { getStuckedBattleCards } from './cardsUtils';
import { itemsGenerator } from './itemsUtils';

jest.mock('../services/Ardor/ardorInterface', () => ({
    getAccountAssets: jest.fn(),
    getAssetsByIssuer: jest.fn(),
    addressToAccountId: jest.fn(),
    getAskOrders: jest.fn(),
    getAsset: jest.fn(),
    getBidOrders: jest.fn(),
    getLastTrades: jest.fn(),
}));

jest.mock('../services/Ardor/omnoInterface', () => ({
    getOmnoMarketOrdesForAsset: jest.fn(),
}));

jest.mock('../services/Elyxir/elyxir', () => ({
    getFlaskAssets: jest.fn(),
}));

jest.mock('../services/Items/Items', () => ({
    getItemsForBonus: jest.fn(),
    getOmnoItemsBalance: jest.fn(),
}));

jest.mock('./cardsUtils', () => ({
    getStuckedBattleCards: jest.fn(),
}));

const potionAsset = '6485210212239811';

const resolveMarketEmpty = () => {
    getAskOrders.mockResolvedValue({ askOrders: [] });
    getBidOrders.mockResolvedValue({ bidOrders: [] });
    getLastTrades.mockResolvedValue({ trades: [] });
    getOmnoMarketOrdesForAsset.mockResolvedValue({ askOrders: [], bidOrders: [] });
};

describe('itemsUtils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getStuckedBattleCards.mockReturnValue({ stuckedCards: {} });
    });

    it('keeps Ardor on-chain quantities when optional inventory metadata fails', async () => {
        getItemsForBonus.mockRejectedValue(new Error('bonus down'));
        getOmnoItemsBalance.mockRejectedValue(new Error('omno down'));
        getFlaskAssets.mockRejectedValue(new Error('elyxir down'));
        getAsset.mockResolvedValue({
            asset: potionAsset,
            name: 'Potion Coral',
            quantityQNT: '100',
        });
        getAskOrders.mockRejectedValue(new Error('ask down'));
        getBidOrders.mockRejectedValue(new Error('bid down'));
        getLastTrades.mockRejectedValue(new Error('trades down'));
        getOmnoMarketOrdesForAsset.mockRejectedValue(new Error('market down'));

        const result = await itemsGenerator(
            [{ asset: potionAsset, quantityQNT: '3', unconfirmedQuantityQNT: '3' }],
            [{ asset: potionAsset }],
            '123'
        );

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            asset: potionAsset,
            quantityQNT: 3,
            metadataLoadFailed: false,
            marketLoadFailed: true,
            bonusLoadFailed: true,
            omnoLoadFailed: true,
            flaskMultiplierLoadFailed: true,
        });
    });

    it('falls back to asset id metadata without losing the on-chain balance', async () => {
        getItemsForBonus.mockResolvedValue([]);
        getOmnoItemsBalance.mockResolvedValue([]);
        getFlaskAssets.mockResolvedValue({});
        getAsset.mockResolvedValue(false);
        resolveMarketEmpty();

        const result = await itemsGenerator(
            [{ asset: potionAsset, quantityQNT: '5', unconfirmedQuantityQNT: '4' }],
            [{ asset: potionAsset }],
            '123'
        );

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            asset: potionAsset,
            name: potionAsset,
            quantityQNT: 5,
            unconfirmedQuantityQNT: '4',
            metadataLoadFailed: true,
            marketLoadFailed: false,
        });
    });
});
