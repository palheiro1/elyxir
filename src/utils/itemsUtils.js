import { IMGURL, ITEMS_ASSETS, ITEMSACCOUNT, NQTDIVIDER } from '../data/CONSTANTS';
import {
    addressToAccountId,
    getAccountAssets,
    getAskOrders,
    getAsset,
    getAssetsByIssuer,
    getBidOrders,
    getLastTrades,
} from '../services/Ardor/ardorInterface';
import { getOmnoMarketOrdesForAsset } from '../services/Ardor/omnoInterface';
import { getItemsForBonus, getOmnoItemsBalance } from '../services/Items/Items';

/**
 * @name fetchAllItems
 * @description Fetches all items for a given Ardor account.
 * Retrieves account assets, item definitions by issuer, and resolves account ID in parallel.
 * Then normalizes the data using `itemsGenerator`.
 * @param {string} accountRs - Ardor account RS identifier.
 * @returns {Promise<Array>} Promise resolving to a list of formatted items.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const fetchAllItems = async accountRs => {
    // Real Ardor asset IDs for testing - these are the real assets from the CSV
    const realItemAssets = [
        // Ingredients
        { asset: '7536385584787697086' }, // aguas_fetidas -> Araucarian Resine
        { asset: '2795734210888256790' }, // alcoholbeer -> Fetid Waters  
        { asset: '16326649816730553703' }, // blood
        { asset: '10917692030112170713' }, // watercristaline
        { asset: '10444425886085847503' }, // water_sea
        { asset: '18101012326255288772' }, // cloud
        { asset: '3607141736374727634' }, // lightninggg
        { asset: '65767141008711421' }, // wind
        { asset: '8717959006135737805' }, // sunlight
        { asset: '488367278629756964' }, // lava
        { asset: '1853993309806999896' }, // alamorcego
        { asset: '10089652431946070133' }, // flordealgodao
        { asset: '8066924493903893072' }, // gardenflower
        { asset: '11436325470737709655' }, // gardensoil
        { asset: '10982823421829006444' }, // herbadeetiopia
        { asset: '1571336020100556625' }, // holi
        { asset: '10982823421829006444' }, // horndust
        { asset: '10089652431946070133' }, // hymalayansnow
        { asset: '1734749669966442838' }, // kangarootail
        { asset: '15102806604556354632' }, // ash (lava mapped to different ID)
        { asset: '11508698419506139756' }, // mustardseeds
        { asset: '6043065774866721090' }, // peyote
        { asset: '11508698419506139756' }, // pluma
        { asset: '10982823421829006444' }, // poisonherb
        { asset: '1571336020100556625' }, // rainboudust
        { asset: '6043065774866721090' }, // rahusaliva
        { asset: '11436325470737709655' }, // sand
        { asset: '1734749669966442838' }, // skin
        { asset: '15230533556325993984' }, // vampirefang
        { asset: '1734749669966442838' }, // wolfsfang
        { asset: '5570219882495290440' }, // diamantebruto
        { asset: '11508698419506139756' }, // feather
        { asset: '15102806604556354632' }, // bonepowder
        { asset: '1571336020100556625' }, // cloud (duplicate with different mapping)
        { asset: '8066924493903893072' }, // sunlight (duplicate)
        
        // Tools
        { asset: '7394449015011337044' }, // bellow
        { asset: '1310229991284473521' }, // cauldron
        { asset: '11845481467736877036' }, // ladle
        { asset: '4548364139683061814' }, // mortar
        
        // Flasks
        { asset: '4367881087678870632' }, // flask1
        { asset: '3758988694981372970' }, // flask2
        { asset: '13463846530496348131' }, // flask3
        { asset: '2440735248419077208' }, // flask4
        { asset: '14654561631655838842' }, // flask5
        
        // Recipes
        { asset: '12936439663349626618' }, // recipe1
        { asset: '7024690161218732154' }, // recipe2
        { asset: '2440735248419077208' }, // recipe3
        { asset: '5570219882495290440' }, // recipe4
        { asset: '14654561631655838842' }, // recipe5
        { asset: '1310229991284473521' }, // recipe6
        { asset: '4548364139683061814' }, // recipe7
        { asset: '7394449015011337044' }, // recipe8
        
        // Created potions
        { asset: '7582224115266007515' }, // tideheart
        { asset: '1310229991284473521' }, // stoneblood
        { asset: '7024690161218732154' }, // coral
        { asset: '2440735248419077208' }, // whispering_gale
        { asset: '5570219882495290440' }, // eternal_silk
        { asset: '14654561631655838842' }, // feathered_flame
        { asset: '1310229991284473521' }, // forgotten_grove
        { asset: '4548364139683061814' } // shifting_dunes
    ];

    const [{ accountAssets }, itemsAssets, accountId] = await Promise.all([
        getAccountAssets(accountRs),
        Promise.resolve(realItemAssets), // Use our real item assets instead of getAssetsByIssuer
        addressToAccountId(accountRs),
    ]);
    return itemsGenerator(accountAssets, itemsAssets, accountId);
};

/**
 * @name itemsGenerator
 * @description Formats assets by merging account and blockchain details.
 * @param {Array} accountAssets - List of account assets with quantities.
 * @param {Array} itemsAssets - List of target assets to fetch details for.
 * @returns {Promise<Array>} List of formatted assets.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const itemsGenerator = async (accountAssets, itemsAssets, accountId) => {
    console.log('itemsGenerator called with:', {
        accountAssetsCount: accountAssets?.length || 0,
        itemsAssetsCount: itemsAssets?.length || 0,
        accountId,
        firstFewAccountAssets: accountAssets?.slice(0, 5)
    });

    const itemsBonus = await getItemsForBonus();

    const itemsOmnoBalance = await getOmnoItemsBalance(accountId, itemsAssets);
    const stuckedCards = {}; // Removed battlegrounds dependency

    // Mapping from real asset IDs to original Elyxir names and images
    const realAssetMapping = {
        // Ingredients
        '7536385584787697086': { name: 'aguas_fetidas', displayName: 'Fetid Waters' },
        '2795734210888256790': { name: 'alcoholbeer', displayName: 'Alcohol Beer' },
        '16326649816730553703': { name: 'blood', displayName: 'Blood' },
        '10917692030112170713': { name: 'watercristaline', displayName: 'Crystal Water' },
        '10444425886085847503': { name: 'water_sea', displayName: 'Sea Water' },
        '18101012326255288772': { name: 'cloud', displayName: 'Cloud' },
        '3607141736374727634': { name: 'lightninggg', displayName: 'Lightning' },
        '65767141008711421': { name: 'wind', displayName: 'Wind' },
        '8717959006135737805': { name: 'sunlight', displayName: 'Sunlight' },
        '488367278629756964': { name: 'lava', displayName: 'Lava' },
        '1853993309806999896': { name: 'alamorcego', displayName: 'Bat Wing' },
        '10089652431946070133': { name: 'flordealgodao', displayName: 'Cotton Flower' },
        '8066924493903893072': { name: 'gardenflower', displayName: 'Garden Flower' },
        '11436325470737709655': { name: 'gardensoil', displayName: 'Garden Soil' },
        '10982823421829006444': { name: 'herbadeetiopia', displayName: 'Ethiopian Herb' },
        '1571336020100556625': { name: 'holi', displayName: 'Holi Powder' },
        '1734749669966442838': { name: 'kangarootail', displayName: 'Kangaroo Tail' },
        '15102806604556354632': { name: 'ash', displayName: 'Ash' },
        '11508698419506139756': { name: 'mustardseeds', displayName: 'Mustard Seeds' },
        '6043065774866721090': { name: 'peyote', displayName: 'Peyote' },
        '15230533556325993984': { name: 'vampirefang', displayName: 'Vampire Fang' },
        '5570219882495290440': { name: 'diamantebruto', displayName: 'Raw Diamond' },
        
        // Tools
        '7394449015011337044': { name: 'bellow', displayName: 'Bellow' },
        '1310229991284473521': { name: 'cauldron', displayName: 'Cauldron' },
        '11845481467736877036': { name: 'ladle', displayName: 'Ladle' },
        '4548364139683061814': { name: 'mortar', displayName: 'Mortar' },
        
        // Flasks
        '4367881087678870632': { name: 'flask1', displayName: 'Flask Level 1' },
        '3758988694981372970': { name: 'flask2', displayName: 'Flask Level 2' },
        '13463846530496348131': { name: 'flask3', displayName: 'Flask Level 3' },
        '2440735248419077208': { name: 'flask4', displayName: 'Flask Level 4' },
        '14654561631655838842': { name: 'flask5', displayName: 'Flask Level 5' },
        
        // Recipes
        '12936439663349626618': { name: 'recipe1', displayName: 'Recipe Level 1' },
        '7024690161218732154': { name: 'recipe2', displayName: 'Recipe Level 2' },
        // Note: recipes 3-8 reuse some asset IDs from above
    };

    const formattedAssets = await Promise.all(
        itemsAssets.map(async asset => {
            const accountAsset = accountAssets.find(a => a.asset === asset.asset);
            const stuckedQnt = stuckedCards?.[asset.asset] || 0;

            let askOrders = [];
            let bidOrders = [];
            let askOmnoOrders = [];
            let bidOmnoOrders = [];
            let lastPrice = 0;
            let lastOmnoPrice = 0;

            const assetDetails = await getAsset(asset.asset);
            const unconfirmedQuantityQNT = accountAsset ? accountAsset.unconfirmedQuantityQNT : 0;
            const totalQuantityQNT = assetDetails?.quantityQNT || 0;
            const quantityQNT = Number(accountAsset?.quantityQNT) || 0;
            const bonus = itemsBonus.find(item => item.asset === assetDetails.asset)?.bonus;

            console.log(`Processing asset ${asset.asset}:`, {
                accountAsset,
                quantityQNT,
                assetDetails: assetDetails?.name,
                hasAccountAsset: !!accountAsset
            });

            // Get the mapped Elyxir name and display name for this real asset
            const assetMapping = realAssetMapping[asset.asset];
            const elyxirName = assetMapping?.name || assetDetails.name;
            const displayName = assetMapping?.displayName || assetDetails.name;

            const [askResponse, bidResponse, lastTradesResponse, omnoOrdersResponse] = await Promise.all([
                getAskOrders(asset.asset),
                getBidOrders(asset.asset),
                getLastTrades(asset.asset),
                getOmnoMarketOrdesForAsset(asset.asset),
            ]);

            askOrders = askResponse.askOrders;
            bidOrders = bidResponse.bidOrders;
            askOmnoOrders = omnoOrdersResponse.askOrders;
            bidOmnoOrders = omnoOrdersResponse.bidOrders;

            if (lastTradesResponse.trades.length > 0) {
                const auxLastPrice = lastTradesResponse.trades[0].priceNQTPerShare / NQTDIVIDER;
                lastPrice = Number.isInteger(auxLastPrice) ? auxLastPrice : auxLastPrice.toFixed(2);
            }

            const omnoBalance = itemsOmnoBalance.find(item => item.asset === asset.asset);
            const omnoQuantity = omnoBalance ? Math.max(0, omnoBalance.quantityQNT - stuckedQnt) : 0;

            delete assetDetails.requestProcessingTime;
            const formattedAsset = {
                ...assetDetails,
                name: displayName, // Use the mapped display name instead of the real asset name
                quantityQNT,
                totalQuantityQNT,
                imgUrl: getItemImage(elyxirName), // Use the mapped Elyxir name for image generation
                bonus,
                omnoQuantity,
                askOrders,
                bidOrders,
                askOmnoOrders,
                bidOmnoOrders,
                lastPrice,
                lastOmnoPrice,
                unconfirmedQuantityQNT,
            };

            return formattedAsset;
        })
    );

    const filteredAssets = formattedAssets.filter(Boolean);
    
    return filteredAssets;
};

/**
 * @name getItemImage
 * @description Utility to generate the URL of an item image based on its name.
 * @param {string} itemName - Name of the item.
 * @returns {string|undefined} Fully qualified image URL, or undefined if no name is provided.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const getItemImage = itemName => {
    if (!itemName || itemName === '') return;
    return `${IMGURL}potions/${itemName}.png`;
};

export const isItemAsset = asset => {
    return ITEMS_ASSETS.includes(asset);
};
