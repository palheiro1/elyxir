import { IMGURL, IMG_THUMB_PATH } from '../../../data/CONSTANTS';
import monsters from '../../../data/monsters.json';

const getCardImage = cardName => {
    const monster = monsters.find(item => item.name === cardName);
    return monster?.assetname ? `${IMGURL}${IMG_THUMB_PATH}${monster.assetname}.jpg` : '/images/cards/card.png';
};

const SOURCES = [
    {
        cardName: 'Mokèlé-mbèmbé',
        cardAssetId: '10956456574154580310',
        minCards: 5,
        ingredientName: 'Crystal Water',
        ingredientAssetId: '13321324699537252353',
        ingredientImage: '/images/elyxir/ingredients/crystwater.png',
        rarity: 'RARE',
    },
    {
        cardName: '/Kaggen',
        cardAssetId: '8825927167203958938',
        minCards: 10,
        ingredientName: 'Garden flower',
        ingredientAssetId: '7879802689430656608',
        ingredientImage: '/images/elyxir/ingredients/gardeflow.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Adaro',
        cardAssetId: '18101012326255288772',
        minCards: 10,
        ingredientName: 'Rainbow shred',
        ingredientAssetId: '18140737140039335538',
        ingredientImage: '/images/elyxir/ingredients/rainbowshd.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Caaporá',
        cardAssetId: '8717959006135737805',
        minCards: 10,
        ingredientName: 'Araucaria resin',
        ingredientAssetId: '7081966488954575750',
        ingredientImage: '/images/elyxir/ingredients/araucariar.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Catoblepas',
        cardAssetId: '15284691712437925618',
        minCards: 10,
        ingredientName: 'Poison herb',
        ingredientAssetId: '15080124236445648438',
        ingredientImage: '/images/elyxir/ingredients/poisonherb.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Dhampir',
        cardAssetId: '609721796834652174',
        minCards: 10,
        ingredientName: 'Vampire fang',
        ingredientAssetId: '14451010716011965584',
        ingredientImage: '/images/elyxir/ingredients/vampirefng.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Droemerdene',
        cardAssetId: '10444425886085847503',
        minCards: 10,
        ingredientName: 'Kangaroo hair',
        ingredientAssetId: '1748542894784204097',
        ingredientImage: '/images/elyxir/ingredients/kangaroohr.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Dudugera',
        cardAssetId: '12936439663349626618',
        minCards: 5,
        ingredientName: 'Cloud',
        ingredientAssetId: '15521713672709080827',
        ingredientImage: '/images/elyxir/ingredients/cloud.png',
        rarity: 'RARE',
    },
    {
        cardName: 'Dybbuk',
        cardAssetId: '9118586585609900793',
        minCards: 2,
        ingredientName: 'Holy water',
        ingredientAssetId: '12308228721908498397',
        ingredientImage: '/images/elyxir/ingredients/holiwater.png',
        rarity: 'EPIC',
    },
    {
        cardName: 'Grootslang',
        cardAssetId: '14906207210027210012',
        minCards: 1,
        ingredientName: 'Diamond',
        ingredientAssetId: '7384993574556043649',
        ingredientImage: '/images/elyxir/ingredients/diamond.png',
        rarity: 'SPECIAL',
    },
    {
        cardName: 'Haechi',
        cardAssetId: '11654119158397769364',
        minCards: 5,
        ingredientName: 'Ash',
        ingredientAssetId: '12210617625866540653',
        ingredientImage: '/images/elyxir/ingredients/ash.png',
        rarity: 'RARE',
    },
    {
        cardName: 'Karkadann',
        cardAssetId: '7536385584787697086',
        minCards: 10,
        ingredientName: 'Horn dust',
        ingredientAssetId: '9093191442487829960',
        ingredientImage: '/images/elyxir/ingredients/horndust.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Kel Essuf',
        cardAssetId: '12313032092046113556',
        minCards: 10,
        ingredientName: 'Desert sand',
        ingredientAssetId: '3042874600616626102',
        ingredientImage: '/images/elyxir/ingredients/desentsand.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Macihuatli',
        cardAssetId: '6086151229884242778',
        minCards: 10,
        ingredientName: 'Mustard seeds',
        ingredientAssetId: '2820535047226119418',
        ingredientImage: '/images/elyxir/ingredients/mustardsd.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Nei Tituaabine',
        cardAssetId: '10917692030112170713',
        minCards: 10,
        ingredientName: 'Lightning',
        ingredientAssetId: '9289482442465517140',
        ingredientImage: '/images/elyxir/ingredients/lightning.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Ninki Nanka',
        cardAssetId: '1328293559375692481',
        minCards: 2,
        ingredientName: 'Fetid water',
        ingredientAssetId: '7464041035414516620',
        ingredientImage: '/images/elyxir/ingredients/fetidwater.png',
        rarity: 'EPIC',
    },
    {
        cardName: 'Pele',
        cardAssetId: '15778342868690621160',
        minCards: 2,
        ingredientName: 'Lava',
        ingredientAssetId: '955451625820789680',
        ingredientImage: '/images/elyxir/ingredients/lava.png',
        rarity: 'EPIC',
    },
    {
        cardName: 'Pua Tu Tahi',
        cardAssetId: '2795734210888256790',
        minCards: 10,
        ingredientName: 'Sea water',
        ingredientAssetId: '16876168465973703622',
        ingredientImage: '/images/elyxir/ingredients/seawater.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Rahu',
        cardAssetId: '9451976923053037726',
        minCards: 10,
        ingredientName: "Rahu's saliva",
        ingredientAssetId: '17969181894960429964',
        ingredientImage: '/images/elyxir/ingredients/rahussaliv.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Rompo',
        cardAssetId: '374078224198142471',
        minCards: 10,
        ingredientName: 'Bone powder',
        ingredientAssetId: '10290172289119183466',
        ingredientImage: '/images/elyxir/ingredients/bonepowder.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Sasquatch',
        cardAssetId: '8504616031553931056',
        minCards: 1,
        ingredientName: 'Bigfoot hair',
        ingredientAssetId: '2380273644117095987',
        ingredientImage: '/images/elyxir/ingredients/bigfoothr.png',
        rarity: 'SPECIAL',
    },
    {
        cardName: 'Şahmaran',
        cardAssetId: '1770779863759720918',
        minCards: 5,
        ingredientName: 'Garden soil',
        ingredientAssetId: '9422436625653721006',
        ingredientImage: '/images/elyxir/ingredients/gardensoil.png',
        rarity: 'RARE',
    },
    {
        cardName: 'Tsenahale',
        cardAssetId: '3758988694981372970',
        minCards: 2,
        ingredientName: 'Feather',
        ingredientAssetId: '11386383170019744285',
        ingredientImage: '/images/elyxir/ingredients/feather.png',
        rarity: 'EPIC',
    },
    {
        cardName: 'Tupilaq',
        cardAssetId: '488367278629756964',
        minCards: 10,
        ingredientName: 'Skin',
        ingredientAssetId: '9627155908350599600',
        ingredientImage: '/images/elyxir/ingredients/skin.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Werewolf',
        cardAssetId: '13430257599807483745',
        minCards: 10,
        ingredientName: 'Wolf fang',
        ingredientAssetId: '7563318252261495089',
        ingredientImage: '/images/elyxir/ingredients/wolffang.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Yeti',
        cardAssetId: '7891814295348826088',
        minCards: 10,
        ingredientName: 'Himalayan snow',
        ingredientAssetId: '9859593227468066316',
        ingredientImage: '/images/elyxir/ingredients/himalayasn.png',
        rarity: 'COMMON',
    },
];

export const ELYXIR_INCUBATION_SOURCES = SOURCES.map(source => ({
    ...source,
    cardImage: getCardImage(source.cardName),
}));

const normalizeAssetId = value => String(value || '').trim();

export const getIncubationSourceByIngredientAsset = assetId =>
    ELYXIR_INCUBATION_SOURCES.find(source => normalizeAssetId(source.ingredientAssetId) === normalizeAssetId(assetId)) ||
    null;

export const getIncubationSourceByCardAsset = assetId =>
    ELYXIR_INCUBATION_SOURCES.find(source => normalizeAssetId(source.cardAssetId) === normalizeAssetId(assetId)) || null;

export const getIncubationSearchText = source =>
    [source?.ingredientName, source?.ingredientAssetId, source?.cardName, source?.cardAssetId, source?.rarity]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

export const getAssetQuantity = (assets = [], assetId) => {
    const match = assets.find(asset => normalizeAssetId(asset.asset || asset.assetId) === normalizeAssetId(assetId));
    return Number(match?.quantityQNT || 0);
};

export const getIncubationOwnership = (source, assets = []) => {
    if (!source) return null;
    const ownedCards = getAssetQuantity(assets, source.cardAssetId);
    const missingCards = Math.max(0, Number(source.minCards || 0) - ownedCards);
    return {
        ownedCards,
        missingCards,
        ready: missingCards === 0,
    };
};
