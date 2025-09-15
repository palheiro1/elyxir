// Elyxir crafting processes configuration derived from message(1).txt
// NOTE: All numeric IDs are Ardor asset IDs represented as strings for consistency.

export const ELYXIR_PROCESSES = {
  version: 1,
  burnAccountTest: "ARDOR-RQYR-NMDJ-3Q8U-9UAXH",
  burnAccountProd: "ARDOR-Q9KZ-74XD-WERK-CV6GB",
  // Duration boundaries (in Ardor blocks). 1440 blocks ~= 1 day
  minDurationBlocks: 1440,
  maxDurationBlocks: 43200,
  flaskMultipliers: {
    "4367881087678870632": 1,  // Conical Flask
    "3758988694981372970": 2,  // Pear-Shaped Flask
    "1328293559375692481": 3,  // Kjeldahl Flask
    "8026549983053279231": 4,  // Florence Flask
    "9118586585609900793": 5   // Round-Bottom Flask
  },
  recipes: [
    {
      recipeAssetId: "12936439663349626618",
      creationAssetId: "6485210212239811", // Whispering Gale
      ingredients: [
        { assetId: "65767141008711421", qtyQNT: 1 },     // Wind Essence
        { assetId: "15284691712437925618", qtyQNT: 1 },  // Feather (Americas)
        { assetId: "18101012326255288772", qtyQNT: 1 }   // Cloud Essence
      ],
      tools: ["7394449015011337044","1310229991284473521","188493294393002400","9451976923053037726"]
    },
    {
      recipeAssetId: "7024690161218732154",
      creationAssetId: "7582224115266007515", // Tideheart
      ingredients: [
        { assetId: "10444425886085847503", qtyQNT: 1 },  // Sea Water
        { assetId: "10917692030112170713", qtyQNT: 1 },  // Crystal Water
        { assetId: "7891814295348826088", qtyQNT: 1 }    // Rainbow Dust
      ],
      tools: ["7394449015011337044","1310229991284473521","188493294393002400","9451976923053037726"]
    },
    {
      recipeAssetId: "11654119158397769364",
      creationAssetId: "10474636406729395731", // Stoneblood
      ingredients: [
        { assetId: "1941380340903453000", qtyQNT: 1 },   // Tree Bark
        { assetId: "17472981396773816914", qtyQNT: 1 },  // (Unmapped ingredient placeholder)
        { assetId: "374078224198142471", qtyQNT: 1 }     // Volcanic Ash (short ID variant)
      ],
      tools: ["7394449015011337044","1310229991284473521","188493294393002400","9451976923053037726"]
    },
    {
      recipeAssetId: "1462047204733593633",
      creationAssetId: "5089659721388119266", // Eternal Silk
      ingredients: [
        { assetId: "13446501052073878899", qtyQNT: 1 },  // Holi Powder
        { assetId: "2603114092541070832", qtyQNT: 1 },   // Himalayan Snow
        { assetId: "8821500247715349893", qtyQNT: 1 }    // (Unmapped ingredient placeholder)
      ],
      tools: ["7394449015011337044","1310229991284473521","188493294393002400","9451976923053037726"]
    },
    {
      recipeAssetId: "6864800023593094679",
      creationAssetId: "8693351662911145147", // Coral Spirits
      ingredients: [
        { assetId: "10444425886085847503", qtyQNT: 1 },  // Sea Water
        { assetId: "16412049206728355506", qtyQNT: 1 },  // Kangaroo Tail
        { assetId: "13430257599807483745", qtyQNT: 1 }   // (Unmapped ingredient placeholder)
      ],
      tools: ["7394449015011337044","1310229991284473521","188493294393002400","9451976923053037726"]
    },
    {
      recipeAssetId: "1770779863759720918",
      creationAssetId: "11206437400477435454", // Feathered Flame
      ingredients: [
        { assetId: "8717959006135737805", qtyQNT: 1 },   // Bottled Sunlight
        { assetId: "15284691712437925618", qtyQNT: 1 },  // Feather
        { assetId: "12313032092046113556", qtyQNT: 1 }   // Peyote
      ],
      tools: ["7394449015011337044","1310229991284473521","188493294393002400","9451976923053037726"]
    },
    {
      recipeAssetId: "10956456574154580310",
      creationAssetId: "12861522637067934750", // Shifting Dunes
      ingredients: [
        { assetId: "10229749181769297696", qtyQNT: 1 },  // (Unmapped ingredient placeholder)
        { assetId: "609721796834652174", qtyQNT: 1 },    // (Unmapped ingredient placeholder)
        { assetId: "583958094572828441", qtyQNT: 1 }     // Mustard Seeds
      ],
      tools: ["7394449015011337044","1310229991284473521","188493294393002400","9451976923053037726"]
    },
    {
      recipeAssetId: "7535070915409870441",
      creationAssetId: "3858707486313568681", // Forgotten Grove
      ingredients: [
        { assetId: "8966516609271135665", qtyQNT: 1 },   // Garden Flower
        { assetId: "1941380340903453000", qtyQNT: 1 },   // Tree Bark
        { assetId: "3865726407233803673", qtyQNT: 1 }    // (Unmapped ingredient placeholder)
      ],
      tools: ["7394449015011337044","1310229991284473521","188493294393002400","9451976923053037726"]
    }
  ]
};

// Quick lookup maps built once.
export const PROCESS_BY_CREATION = Object.fromEntries(ELYXIR_PROCESSES.recipes.map(r => [r.creationAssetId, r]));
export const PROCESS_BY_RECIPE = Object.fromEntries(ELYXIR_PROCESSES.recipes.map(r => [r.recipeAssetId, r]));

export function getProcessByCreation(creationAssetId) {
  return PROCESS_BY_CREATION[creationAssetId] || null;
}
export function getProcessByRecipe(recipeAssetId) {
  return PROCESS_BY_RECIPE[recipeAssetId] || null;
}

export function computeRequiredIngredients(process, flaskMultiplier = 1) {
  if (!process) return [];
  return process.ingredients.map(i => ({ ...i, required: i.qtyQNT * flaskMultiplier }));
}

// assets: array of { asset, quantityQNT }
export function canCraftProcess(process, assets = [], flaskMultiplier = 1) {
  if (!process) return false;
  const reqs = computeRequiredIngredients(process, flaskMultiplier);
  for (const r of reqs) {
    const have = assets.find(a => a.asset === r.assetId);
    if (!have || Number(have.quantityQNT) < r.required) return false;
  }
  // Check tools existence only (not quantities)
  for (const toolId of process.tools) {
    if (!assets.some(a => a.asset === toolId)) return false;
  }
  return true;
}
