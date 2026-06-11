import {
    getIncubationOwnership,
    getIncubationSourceByIngredientAsset,
} from './incubationSources';

describe('Elyxir incubation sources', () => {
    it('resolves Sea Water to Pua Tu Tahi', () => {
        const source = getIncubationSourceByIngredientAsset('16876168465973703622');

        expect(source).toMatchObject({
            ingredientName: 'Sea water',
            cardName: 'Pua Tu Tahi',
            cardAssetId: '2795734210888256790',
            minCards: 10,
        });
    });

    it('calculates missing cards from account assets', () => {
        const source = getIncubationSourceByIngredientAsset('16876168465973703622');
        const ownership = getIncubationOwnership(source, []);

        expect(ownership).toEqual({
            ownedCards: 0,
            missingCards: 10,
            ready: false,
        });
    });
});
