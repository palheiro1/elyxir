import { useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Heading, Text, Box, Stack, Button, Image, Tooltip, HStack, Tag, Badge, Progress, Wrap, WrapItem, useColorModeValue } from '@chakra-ui/react';
import GridCards from '../../Cards/GridCards';

// Map item names to image paths (fix for lowercase/underscores)
const imageFor = (name, type) => {
    if (!name) return '';
    const n = name.toLowerCase().replace(/ /g, '_');
    if (type === 'ingredients') return `/images/elyxir/ingredients/${n}.png`;
    if (type === 'tools') return `/images/elyxir/tools/${n.replace(/bellows/, 'bellow')}.png`;
    if (type === 'flasks') return `/images/elyxir/flasks/flask${n.match(/(conical|pear|kjeldahl|florence|round)/) ? ['conical','pear','kjeldahl','florence','round'].findIndex(f=>n.includes(f))+1 : 1}.png`;
    if (type === 'recipes') return `/images/elyxir/${n}.png`;
    if (type === 'outputs') return `/images/elyxir/outputs/${n}.png`;
    return '';
};

const classifyItem = name => {
    if (!name) return 'others';
    const n = name.toLowerCase();
    if (n.includes('recipe')) return 'recipes';
    if (["herb", "mushroom", "flower", "shard"].some(k => n.includes(k))) return 'ingredients';
    if (["bellows", "cauldron", "mortar", "ladle"].some(k => n.includes(k))) return 'tools';
    if (n.includes('flask')) return 'flasks';
    return 'others';
};

const groupItemsByType = items =>
    items.reduce((acc, item) => {
        const type = classifyItem(item.name);
        acc[type] = acc[type] || [];
        acc[type].push(item);
        return acc;
    }, {});


// Full set of example potion recipes, each with a matching output name and image
const RECIPES = [
    {
        id: 'whispering_gale',
        name: 'Whispering Gale',
        ingredients: [
            { name: 'Cloud Essence', quantity: 1 },
            { name: 'Wind Essence', quantity: 2 },
            { name: 'Himalayan Snow', quantity: 1 },
        ],
        tools: ['Stone Mortar', 'Ancient Cauldron'],
        successRate: 0.8,
        result: 'Whispering Gale',
    },
    {
        id: 'tideheart',
        name: 'Tideheart',
        ingredients: [
            { name: 'Crystal Water', quantity: 2 },
            { name: 'Sea Water', quantity: 1 },
            { name: 'Garden Flower', quantity: 1 },
        ],
        tools: ['Silver Ladle', 'Ancient Cauldron'],
        successRate: 0.75,
        result: 'Tideheart',
    },
    {
        id: 'stoneblood',
        name: 'Stoneblood',
        ingredients: [
            { name: 'Bone Powder', quantity: 1 },
            { name: 'Garden Soil', quantity: 2 },
            { name: 'Raw Diamond', quantity: 1 },
        ],
        tools: ['Stone Mortar', 'Mystical Bellows'],
        successRate: 0.7,
        result: 'Stoneblood',
    },
    {
        id: 'shifting_dunes',
        name: 'Shifting Dunes',
        ingredients: [
            { name: 'Desert Sand', quantity: 2 },
            { name: 'Volcanic Ash', quantity: 1 },
            { name: 'Bottled Sunlight', quantity: 1 },
        ],
        tools: ['Ancient Cauldron', 'Mystical Bellows'],
        successRate: 0.68,
        result: 'Shifting Dunes',
    },
    {
        id: 'forgotten_grove',
        name: 'Forgotten Grove',
        ingredients: [
            { name: 'Healing Herb', quantity: 2 },
            { name: 'Garden Flower', quantity: 1 },
            { name: 'Tree Bark', quantity: 1 },
        ],
        tools: ['Stone Mortar', 'Silver Ladle'],
        successRate: 0.72,
        result: 'Forgotten Grove',
    },
    {
        id: 'feathered_flame',
        name: 'Feathered Flame',
        ingredients: [
            { name: 'Magic Pollen', quantity: 2 },
            { name: 'Volcano Lava', quantity: 1 },
            { name: 'Thunder Essence', quantity: 1 },
        ],
        tools: ['Mystical Bellows', 'Silver Ladle'],
        successRate: 0.7,
        result: 'Feathered Flame',
    },
    {
        id: 'eternal_silk',
        name: 'Eternal Silk',
        ingredients: [
            { name: 'Magic Dust', quantity: 1 },
            { name: 'Garden Flower', quantity: 2 },
            { name: 'Bottled Sunlight', quantity: 1 },
        ],
        tools: ['Stone Mortar', 'Ancient Cauldron'],
        successRate: 0.77,
        result: 'Eternal Silk',
    },
    {
        id: 'coral',
        name: 'Coral',
        ingredients: [
            { name: 'Sea Water', quantity: 2 },
            { name: 'Stardust', quantity: 1 },
            { name: 'Garden Flower', quantity: 1 },
        ],
        tools: ['Ancient Cauldron', 'Silver Ladle'],
        successRate: 0.74,
        result: 'Coral',
    },
];


const Elyxir = ({ infoAccount }) => {
    const { items } = useSelector(state => state.items);
    const [message, setMessage] = useState('');
    // Alchemy UI state
    const [selectedRecipeIdx, setSelectedRecipeIdx] = useState(0);
    const [craftDuration, setCraftDuration] = useState(300); // default 5 min
    const [craftingProgress, setCraftingProgress] = useState(0); // percent
    // UI colors (hooks must be at top level)
    const sectionBg = useColorModeValue('gray.50', 'gray.800');

    // Create assets using real Ardor asset IDs from the blockchain (same as Inventory and Market)
    const fakeAssets = useMemo(() => {
        // Real Ardor Asset IDs mapping (from CSV file)
        const realAssetIds = {
            // Ingredients
            'aguas_fetidas': '7536385584787697086',
            'alcoholbeer': '2795734210888256790',
            'blood': '16326649816730553703',
            'watercristaline': '10917692030112170713',
            'water_sea': '10444425886085847503',
            'cloud': '18101012326255288772',
            'lightninggg': '3607141736374727634',
            'wind': '65767141008711421',
            'sunlight': '8717959006135737805',
            'lava': '488367278629756964',
            'flordealgodao': '6086151229884242778',
            'gardenflower': '8966516609271135665',
            'corteza': '1941380340903453000',
            'herbadeetiopia': '5528548442683058721',
            'poisonherb': '524790161704873898',
            'mustardseeds': '583958094572828441',
            'peyote': '12313032092046113556',
            'alamorcego': '8825927167203958938',
            'bigfootshair': '4735490741705855799',
            'feather': '15284691712437925618',
            'kangarootail': '16412049206728355506',
            'vampirefang': '1853993309806999896',
            'wolfsfang': '1734749669966442838',
            'araucarianresine': '9146455733851008946',
            'ash': '15102806604556354632',
            'bonepowder': '10982823421829006444',
            'diamantebruto': '5570219882495290440',
            'gardensoil': '11508698419506139756',
            'horndust': '10089652431946070133',
            'hymalayansnow': '2603114092541070832',
            'pluma': '15230533556325993984',
            'skin': '11436325470737709655',
            'sand': '6043065774866721090',
            'rahusaliva': '1571336020100556625',
            'rainboudust': '7891814295348826088',
            'holi': '13446501052073878899',
            // Tools
            'bellow': '7394449015011337044',
            'cauldron': '1310229991284473521',
            'ladle': '9451976923053037726',
            'mortar': '188493294393002400',
            // Flasks
            'conical_flask': '4367881087678870632',
            'pear_flask': '3758988694981372970',
            'kjeldahl_flask': '1328293559375692481',
            'florence_flask': '8026549983053279231',
            'round_flask': '9118586585609900793',
            // Potions (Creations)
            'whispering_gale': '6485210212239811',
            'tideheart': '7582224115266007515',
            'stoneblood': '10474636406729395731',
            'eternal_silk': '5089659721388119266',
            'coral_spirits': '8693351662911145147',
            'feathered_flame': '11206437400477435454',
            'shifting_dunes': '12861522637067934750',
            'forgotten_grove': '3858707486313568681',
            // Recipes
            'recipe_whispering_gale': '12936439663349626618',
            'recipe_tideheart': '7024690161218732154',
            'recipe_stoneblood': '11654119158397769364',
            'recipe_eternal_silk': '1462047204733593633',
            'recipe_coral_spirits': '6864800023593094679',
            'recipe_feathered_flame': '1770779863759720918',
            'recipe_shifting_dunes': '10956456574154580310',
            'recipe_forgotten_grove': '7535070915409870441'
        };

        // Mapping of image file names to proper names (matching Inventory and Market)
        const ingredientNameMap = {
            'aguas_fetidas': 'Fetid Waters',
            'alamorcego': 'Bat Wing',
            'alcoholbeer': 'Alcohol Beer',
            'araucarianresine': 'Araucarian Resine',
            'ash': 'Volcanic Ash',
            'bigfootshair': 'Bigfoot Hair',
            'blood': 'Blood',
            'bonepowder': 'Bone Powder',
            'cloud': 'Cloud Essence',
            'corteza': 'Tree Bark',
            'diamantebruto': 'Raw Diamond',
            'feather': 'Feather',
            'flordealgodao': 'Cotton Flower',
            'gardenflower': 'Garden Flower',
            'gardensoil': 'Garden Soil',
            'herbadeetiopia': 'Ethiopian Herb',
            'holi': 'Holi Powder',
            'horndust': 'Horn Dust',
            'hymalayansnow': 'Himalayan Snow',
            'kangarootail': 'Kangaroo Tail',
            'lava': 'Volcano Lava',
            'lightninggg': 'Lightning Essence',
            'mustardseeds': 'Mustard Seeds',
            'peyote': 'Peyote',
            'pluma': 'Feather',
            'poisonherb': 'Poison Herb',
            'rainboudust': 'Rainbow Dust',
            'rahusaliva': 'Rahu Saliva',
            'sand': 'Desert Sand',
            'skin': 'Snake Skin',
            'sunlight': 'Bottled Sunlight',
            'vampirefang': 'Vampire Blood',
            'watercristaline': 'Crystal Water',
            'water_sea': 'Sea Water',
            'wind': 'Wind Essence',
            'wolfsfang': 'Wolf Fang',
            'arena_del_desierto': 'Desert Sand',
            'colmillo_de_vampiro': 'Vampire Blood',
            'colmillo_de_lobo': 'Wolf Fang'
        };

        const ingredients = [
            'aguas_fetidas', 'alamorcego', 'alcoholbeer', 'araucarianresine', 'ash', 'bigfootshair', 'blood', 
            'bonepowder', 'cloud', 'corteza', 'diamantebruto', 'feather', 'flordealgodao', 'gardenflower',
            'gardensoil', 'herbadeetiopia', 'holi', 'horndust', 'hymalayansnow', 'kangarootail', 'lava',
            'lightninggg', 'mustardseeds', 'peyote', 'pluma', 'poisonherb', 'rainboudust', 'rahusaliva',
            'sand', 'skin', 'sunlight', 'vampirefang', 'watercristaline', 'water_sea', 'wind', 'wolfsfang'
        ].map((name, index) => {
            const assetId = realAssetIds[name] || `fake_ingredient_${index}`;
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
            const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
            const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;
            
            return {
                asset: assetId,
                name: ingredientNameMap[name] || name.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase()),
                description: `A mystical ingredient for potion crafting`,
                quantityQNT: realQuantity,
                totalQuantityQNT: 1,
                unconfirmedQuantityQNT: realUnconfirmedQuantity,
                imgUrl: `/images/elyxir/ingredients/${name}.png`,
                elyxirType: 'INGREDIENT',
                isFake: true,
            };
        });

        const tools = [
            { name: 'Mystical Bellows', description: 'Used to heat up potions during crafting', image: 'bellow.png', key: 'bellow' },
            { name: 'Ancient Cauldron', description: 'Essential for mixing ingredients together', image: 'cauldron.png', key: 'cauldron' },
            { name: 'Silver Ladle', description: 'For transferring potions into flasks', image: 'ladle.png', key: 'ladle' },
            { name: 'Stone Mortar', description: 'Grinds ingredients to release their full potential', image: 'mortar.png', key: 'mortar' }
        ].map((tool, index) => {
            const assetId = realAssetIds[tool.key] || `fake_tool_${index}`;
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
            const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
            const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;
            
            return {
                asset: assetId,
                name: tool.name,
                description: tool.description,
                quantityQNT: realQuantity,
                totalQuantityQNT: 1,
                unconfirmedQuantityQNT: realUnconfirmedQuantity,
                imgUrl: `/images/elyxir/tools/${tool.image}`,
                elyxirType: 'TOOL',
                isFake: true,
            };
        });

        const flasks = [
            { name: 'Conical Flask', description: 'Specialized conical laboratory flask', image: 'flask1.png', key: 'conical_flask' },
            { name: 'Pear-Shaped Flask', description: 'Unique pear-shaped distillation flask', image: 'flask2.png', key: 'pear_flask' },
            { name: 'Kjeldahl Flask', description: 'Professional analytical flask', image: 'flask3.png', key: 'kjeldahl_flask' },
            { name: 'Florence Flask', description: 'Classic round-bottom florence flask', image: 'flask4.png', key: 'florence_flask' },
            { name: 'Round-Bottom Flask', description: 'Standard round-bottom flask', image: 'flask5.png', key: 'round_flask' }
        ].map((flask, index) => {
            const assetId = realAssetIds[flask.key] || `fake_flask_${index}`;
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
            const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
            const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;
            
            return {
                asset: assetId,
                name: flask.name,
                description: flask.description,
                quantityQNT: realQuantity,
                totalQuantityQNT: 1,
                unconfirmedQuantityQNT: realUnconfirmedQuantity,
                imgUrl: `/images/elyxir/flasks/${flask.image}`,
                elyxirType: 'FLASK',
                isFake: true,
            };
        });

        const recipes = [
            { name: 'Recipe of the Whispering Gale Potion', description: 'Ancient formula for aerial enhancement', image: 'recipe1.png', key: 'recipe_whispering_gale' },
            { name: 'Recipe of the Tideheart Potion', description: 'Aquatic power brewing instructions', image: 'recipe2.png', key: 'recipe_tideheart' },
            { name: 'Recipe of the Stoneblood Potion', description: 'Terrestrial strength elixir formula', image: 'recipe1.png', key: 'recipe_stoneblood' },
            { name: 'Recipe of the Eternal Silk Potion', description: 'Asiatic wisdom brewing guide', image: 'recipe2.png', key: 'recipe_eternal_silk' },
            { name: 'Recipe of the Coral Spirits Potion', description: 'Oceanic essence creation method', image: 'recipe1.png', key: 'recipe_coral_spirits' },
            { name: 'Recipe of the Feathered Flame Potion', description: 'Americas spirit brewing technique', image: 'recipe2.png', key: 'recipe_feathered_flame' },
            { name: 'Recipe of the Shifting Dunes Potion', description: 'African power enhancement formula', image: 'recipe1.png', key: 'recipe_shifting_dunes' },
            { name: 'Recipe of the Forgotten Grove Potion', description: 'European strength elixir guide', image: 'recipe2.png', key: 'recipe_forgotten_grove' }
        ].map((recipe, index) => {
            const assetId = realAssetIds[recipe.key] || `fake_recipe_${index}`;
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
            const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
            const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;
            
            return {
                asset: assetId,
                name: recipe.name,
                description: recipe.description,
                quantityQNT: realQuantity,
                totalQuantityQNT: 1,
                unconfirmedQuantityQNT: realUnconfirmedQuantity,
                imgUrl: `/images/elyxir/recipes/${recipe.image}`,
                elyxirType: 'RECIPE',
                isFake: true,
            };
        });

        const potions = [
            { name: 'Whispering Gale Potion', description: 'Harnesses the power of wind and storms', image: 'whispering_gale.png', key: 'whispering_gale' },
            { name: 'Tideheart Potion', description: 'Contains the essence of ocean tides', image: 'tideheart.png', key: 'tideheart' },
            { name: 'Stoneblood Potion', description: 'Infused with the strength of mountains', image: 'stoneblood.png', key: 'stoneblood' },
            { name: 'Eternal Silk Potion', description: 'Woven with ancient Asian wisdom', image: 'eternal_silk.png', key: 'eternal_silk' },
            { name: 'Coral Spirits Potion', description: 'Blessed by oceanic guardians', image: 'coral_spirits.png', key: 'coral_spirits' },
            { name: 'Feathered Flame Potion', description: 'Burns with the spirit of the Americas', image: 'feathered_flame.png', key: 'feathered_flame' },
            { name: 'Shifting Dunes Potion', description: 'Holds the mystery of African deserts', image: 'shifting_dunes.png', key: 'shifting_dunes' },
            { name: 'Forgotten Grove Potion', description: 'Remembers ancient European forests', image: 'forgotten_grove.png', key: 'forgotten_grove' }
        ].map((potion, index) => {
            const assetId = realAssetIds[potion.key] || `fake_potion_${index}`;
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
            const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
            const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;
            
            return {
                asset: assetId,
                name: potion.name,
                description: potion.description,
                quantityQNT: realQuantity,
                totalQuantityQNT: 1,
                unconfirmedQuantityQNT: realUnconfirmedQuantity,
                imgUrl: `/images/elyxir/potions/${potion.image}`,
                elyxirType: 'CREATION',
                isFake: true,
            };
        });

        return { ingredients, tools, flasks, recipes, potions };
    }, [infoAccount?.assets]);

    // Use the properly formatted assets instead of raw Redux items
    const allElyxirItems = useMemo(() => {
        return [
            ...fakeAssets.ingredients,
            ...fakeAssets.tools,
            ...fakeAssets.flasks,
            ...fakeAssets.recipes,
            ...fakeAssets.potions
        ];
    }, [fakeAssets]);

    // Group items by type for recipe checking
    const grouped = useMemo(() => {
        const result = {};
        allElyxirItems.forEach(item => {
            const type = item.elyxirType.toLowerCase() + 's';
            if (!result[type]) result[type] = [];
            result[type].push(item);
        });
        return result;
    }, [allElyxirItems]);
                    // Get missing items for recipe crafting (updated to use new data structure)
    const getMissingItems = useCallback(
        recipe => {
            const missing = [];
            if (recipe.ingredients) {
                recipe.ingredients.forEach(req => {
                    const item = grouped.ingredients?.find(i => i.name.toLowerCase() === req.name.toLowerCase());
                    const have = item ? Number(item.quantityQNT) : 0;
                    if (have < req.quantity) missing.push(`${req.quantity - have}x ${req.name}`);
                });
            }
            if (recipe.tools) {
                recipe.tools.forEach(name => {
                    if (!grouped.tools?.some(i => i.name.toLowerCase() === name.toLowerCase()))
                        missing.push(name);
                });
            }
            return missing;
        },
        [grouped]
    );
            };
            
            return nameMap[filename] || filename
                .replace('.png', '')
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
        }

        const ALL_ITEMS = {
            ingredients: INGREDIENT_IMAGE_FILES.map(f => ({ name: filenameToName(f), image: `/images/elyxir/ingredients/${f}` })),
            tools: [
                { name: 'Stone Mortar' },
                { name: 'Ancient Cauldron' },
                { name: 'Mystical Bellows' },
                { name: 'Silver Ladle' },
            ],
            flasks: [
                { name: 'Crystal Flask' },
                { name: 'Emerald Flask' },
                { name: 'Sapphire Flask' },
                { name: 'Ruby Flask' },
                { name: 'Diamond Flask' },
            ],
            recipes: [
                { name: 'Recipe of the Coral Potion' },
                { name: 'Recipe of the Stoneblood Potion' },
            ],
            creations: [
                { name: 'Whispering Gale Potion' },
                { name: 'Tideheart Potion' },
                { name: 'Stoneblood Potion' },
            ],
        };

        // Return all ingredients as filtered ingredients (no search functionality)
        const filteredIngredients = ALL_ITEMS.ingredients;

        return { ALL_ITEMS, filteredIngredients };
    }, []);

    // Group owned items by type
    const grouped = useMemo(() => groupItemsByType(items), [items]);

    // For each type, merge ALL_ITEMS with owned items, marking quantityQNT = 0 if not owned
    // ...existing code... (remove unused mergedItems)

    // Show all recipes in the workshop, even if user doesn't own any
    // ...existing code... (remove unused availableRecipes)
    const getMissingItems = useCallback(
        recipe => {
            const missing = [];
            if (recipe.ingredients) {
                recipe.ingredients.forEach(req => {
                    const item = grouped.ingredients?.find(i => i.name.toLowerCase() === req.name.toLowerCase());
                    const have = item ? Number(item.quantityQNT) : 0;
                    if (have < req.quantity) missing.push(`${req.quantity - have}x ${req.name}`);
                });
            }
            if (recipe.tools) {
                recipe.tools.forEach(name => {
                    if (!grouped.tools?.some(i => i.name.toLowerCase() === name.toLowerCase()))
                        missing.push(name);
                });
            }
            // Flasks are optional; only check if present
            if (recipe.flasks && Array.isArray(recipe.flasks)) {
                recipe.flasks.forEach(name => {
                    if (!grouped.flasks?.some(i => i.name.toLowerCase() === name.toLowerCase()))
                        missing.push(name);
                });
            }
            return missing;
        },
        [grouped]
    );
    const handleCraft = recipe => {
        const missing = getMissingItems(recipe);
        if (missing.length) {
            setMessage(`Missing: ${missing.join(', ')}`);
            return;
        }
        const success = Math.random() < recipe.successRate;
        if (success) {
            setMessage(`Success! You created ${recipe.result}.`);
        } else {
            const incident = Math.random() < 0.5 ? 'Failure' : 'Explosion';
            if (incident === 'Failure')
                setMessage('Failure: ingredients lost but tools and flasks remain.');
            else setMessage('Explosion: all items consumed!');
        }
    };
    // Prepare recipe cards for GridCards, removing burning info and asset fields
    // Map recipe result to real output image filenames
    const outputImageMap = {
        'Whispering Gale': 'PotionWhisperingGale.png',
        'Tideheart': 'PotionTideheart.png',
        'Stoneblood': 'PotionStoneblood .png',
        'Shifting Dunes': 'Potion of the Shifting Dunes.png',
        'Forgotten Grove': 'PotionoftheForgottenGrove.png',
        'Feathered Flame': 'PotionoftheFeatheredFlame.png',
        'Eternal Silk': 'PotionofheEternalSilk.png',
        'Coral': 'PotionCoral.png',
    };
    const recipeCards = RECIPES.map((r, idx) => {
        const outputImg = r.result && outputImageMap[r.result]
            ? `/images/elyxir/outputs/${outputImageMap[r.result]}`
            : '';
        return {
            ...r,
            cardImgUrl: outputImg,
            name: r.name,
            description: `${Math.round(r.successRate * 100)}% success`,
            setSelectedRecipeIdx,
            idx,
            isSelected: selectedRecipeIdx === idx,
            burnedQuantity: 0,
            totalQuantityQNT: 1,
            quantityQNT: 1,
            asset: undefined,
            rarity: 'Recipe',
            tools: r.tools,
            ingredients: r.ingredients.map(i => ({
                ...i,
                image: imageFor(i.name, 'ingredients'),
            })),
            flasks: [],
            outputImg,
        };
    });

    return (
        <Box p={4}>
            <Heading size="sm" color="purple.200" mb={2}>Available Recipes</Heading>
            <GridCards
                cards={recipeCards}
                isMarket={false}
                onlyBuy={false}
                infoAccount={{}}
                market={''}
                rgbColor="128, 90, 213"
            />
            {/* Detail panel for selected recipe */}
            {RECIPES[selectedRecipeIdx] && (() => {
                const r = RECIPES[selectedRecipeIdx];
                const missing = getMissingItems(r);

                // Only tools and ingredients are required
                const makeReqData = () => {
                    return {
                        tools: r.tools.map(name => {
                            const owned = grouped.tools?.some(i => i.name.toLowerCase() === name.toLowerCase());
                            return { name, owned, image: imageFor(name, 'tools'), type: 'Tool' };
                        }),
                        ingredients: r.ingredients.map(req => {
                            const owned = grouped.ingredients?.find(i => i.name.toLowerCase() === req.name.toLowerCase());
                            const have = owned ? owned.quantityQNT : 0;
                            return {
                                name: req.name,
                                owned: have >= req.quantity,
                                have,
                                need: req.quantity,
                                image: imageFor(req.name, 'ingredients'),
                                type: 'Ingredient',
                            };
                        }),
                    };
                };
                const req = makeReqData();

                const Chip = ({ item }) => {
                    const border = item.owned ? 'green.400' : 'red.400';
                    const bg = item.owned ? 'green.900' : 'red.900';
                    return (
                        <Tooltip label={`${item.type}` + (item.need ? ` | Need ${item.need}` : '')}>
                            <Box
                                borderWidth="1px"
                                borderColor={border}
                                bg={bg}
                                p={2}
                                rounded="md"
                                minW="90px"
                                textAlign="center"
                                display="flex"
                                flexDir="column"
                                gap={1}
                            >
                                <Image src={item.image} alt={item.name} boxSize="42px" mx="auto" />
                                <Text fontSize="2xs" fontWeight="bold" noOfLines={1}>{item.name}</Text>
                                {item.need ? (
                                    <Badge colorScheme={item.owned ? 'green' : 'red'} fontSize="0.6rem">
                                        {item.have}/{item.need}
                                    </Badge>
                                ) : (
                                    <Badge colorScheme={item.owned ? 'green' : 'red'} fontSize="0.6rem">
                                        {item.owned ? 'Owned' : 'Missing'}
                                    </Badge>
                                )}
                            </Box>
                        </Tooltip>
                    );
                };

                const Group = ({ title, color, items }) => (
                    <Box flex={1} minW={{ base: '100%', md: '30%' }}>
                        <HStack mb={2} spacing={2}>
                            <Box w="6px" h="20px" bg={color} rounded="sm" />
                            <Text fontSize="sm" fontWeight="bold" letterSpacing="wide">{title}</Text>
                            <Badge colorScheme={items.every(i => i.owned) ? 'green' : 'orange'}>
                                {items.filter(i => i.owned).length}/{items.length}
                            </Badge>
                        </HStack>
                        <Wrap spacing={3}>
                            {items.map(i => (
                                <WrapItem key={i.name}><Chip item={i} /></WrapItem>
                            ))}
                        </Wrap>
                    </Box>
                );

                return (
                    <Box
                        className="alchemy-detail"
                        position="relative"
                        mt={10}
                        rounded="xl"
                        px={{ base: 4, md: 8 }}
                        py={6}
                        overflow="hidden"
                        bg={sectionBg}
                    >
                        <Stack direction={{ base: 'column', lg: 'row' }} spacing={8} align="flex-start">
                            {/* Left summary */}
                            <Box flex={1} minW={{ base: '100%', lg: '260px' }}>
                                <HStack spacing={4} align="flex-start" mb={4}>
                                    <Image src={recipeCards[selectedRecipeIdx]?.outputImg || ''} alt={r.name} boxSize="90px" rounded="lg" shadow="md" />
                                    <Stack spacing={2} flex={1}>
                                        <Heading size="md" color="purple.300">{r.name}</Heading>
                                        <HStack spacing={2} wrap="wrap">
                                            <Tag size="sm" colorScheme="purple">{Math.round(r.successRate * 100)}% success</Tag>
                                            <Tag size="sm" colorScheme={missing.length ? 'red' : 'green'}>
                                                {missing.length ? `${missing.length} missing` : 'All requirements met'}
                                            </Tag>
                                        </HStack>
                                    </Stack>
                                </HStack>
                                {/* Start process section restored */}
                                <Box mt={2}>
                                    <Text fontSize="xs" mb={1} color="gray.500">Craft duration</Text>
                                    <HStack spacing={3} align="center">
                                        <input
                                            type="range"
                                            min="60"
                                            max="600"
                                            step="60"
                                            value={craftDuration}
                                            onChange={e => setCraftDuration(Number(e.target.value))}
                                            style={{ width: '100%' }}
                                        />
                                        <Tag size="sm" variant="subtle" colorScheme="purple">
                                            {Math.floor(craftDuration / 60)}m
                                        </Tag>
                                    </HStack>
                                </Box>
                                <Box mt={4}>
                                    <Button
                                        w="100%"
                                        colorScheme="purple"
                                        size="md"
                                        onClick={() => handleCraft(r)}
                                        isDisabled={!!missing.length}
                                    >
                                        {missing.length ? 'Missing Items' : 'Start Craft'}
                                    </Button>
                                </Box>
                                <Box mt={4}>
                                    <Progress value={craftingProgress} size="sm" colorScheme="purple" rounded="full" />
                                </Box>
                                {message && (
                                    <Text mt={3} fontSize="sm" color="purple.300">{message}</Text>
                                )}
                                {!!missing.length && (
                                    <Text mt={2} fontSize="xs" color="red.300">Missing: {missing.join(', ')}</Text>
                                )}
                            </Box>
                            {/* Right requirements */}
                            <Stack flex={2} spacing={8} width="100%">
                                <Stack spacing={6}>
                                    <Group title="Tools" color="#3B7197" items={req.tools} />
                                    <Group title="Ingredients" color="#7E9246" items={req.ingredients} />
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>
                );
            })()}
        </Box>
    );
};

export default Elyxir;