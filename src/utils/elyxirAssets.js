// Utility helpers to classify Elyxir-related assets from account assets.
// Asset IDs sourced from existing Elyxir page and processes config.

import { ELYXIR_PROCESSES } from '../data/elyxirProcesses';

// Known grouped asset ids (extend as needed)
export const ELYXIR_ID_GROUPS = {
  // Align with IDs used in Inventory mapping (source of truth for balances)
  ingredients: new Set([
    '7536385584787697086', // aguas_fetidas
    '2795734210888256790', // alcoholbeer
    '16326649816730553703', // blood
    '10917692030112170713', // watercristaline
    '10444425886085847503', // water_sea
    '18101012326255288772', // cloud
    '3607141736374727634', // lightninggg
    '65767141008711421', // wind
    '8717959006135737805', // sunlight
    '488367278629756964', // lava
    '6086151229884242778', // flordealgodao
    '8966516609271135665', // gardenflower
    '1941380340903453000', // corteza
    '5528548442683058721', // herbadeetiopia
    '524790161704873898', // poisonherb
    '583958094572828441', // mustardseeds
    '12313032092046113556', // peyote
    '8825927167203958938', // alamorcego
    '4735490741705855799', // bigfootshair
    '15284691712437925618', // feather
    '16412049206728355506', // kangarootail
    '9057629654312953814', // vampirefang (inventory mapping)
    '3865726407233803673', // wolfsfang (inventory mapping)
    '13430257599807483745', // araucarianresine
    '374078224198142471', // ash
    '17472981396773816914', // bonepowder
    '1479526493428793943', // horndust (inventory mapping)
    '2603114092541070832', // hymalayansnow
    '15230533556325993984', // pluma
    '609721796834652174', // skin (snake skin)
    '10229749181769297696', // sand
    '465570788961452184', // gardensoil (inventory mapping)
    '13446501052073878899', // holi
    '7891814295348826088', // rainboudust
    '8821500247715349893', // rahusaliva
  ]),
  tools: new Set([
    '7394449015011337044', // bellow
    '1310229991284473521', // cauldron
    '188493294393002400', // mortar
    '9451976923053037726' // ladle
  ]),
  flasks: new Set([
    '4367881087678870632', // conical
    '3758988694981372970', // pear
    '1328293559375692481', // kjeldahl
    '8026549983053279231', // florence
    '9118586585609900793' // round
  ]),
  creations: new Set([
    '6485210212239811', // whispering_gale
    '7582224115266007515', // tideheart
    '10474636406729395731', // stoneblood
    '5089659721388119266', // eternal_silk
    '8693351662911145147', // coral_spirits
    '11206437400477435454', // feathered_flame
    '12861522637067934750', // shifting_dunes
    '3858707486313568681' // forgotten_grove
  ]),
  recipes: new Set([
    '12936439663349626618', // recipe_whispering_gale
    '7024690161218732154', // recipe_tideheart
    '11654119158397769364', // recipe_stoneblood
    '1462047204733593633', // recipe_eternal_silk
    '6864800023593094679', // recipe_coral_spirits
    '1770779863759720918', // recipe_feathered_flame
    '10956456574154580310', // recipe_shifting_dunes
    '7535070915409870441' // recipe_forgotten_grove
  ])
};

export function classifyElyxirAsset(assetId) {
  if (ELYXIR_ID_GROUPS.ingredients.has(assetId)) return 'INGREDIENT';
  if (ELYXIR_ID_GROUPS.tools.has(assetId)) return 'TOOL';
  if (ELYXIR_ID_GROUPS.flasks.has(assetId)) return 'FLASK';
  if (ELYXIR_ID_GROUPS.creations.has(assetId)) return 'CREATION';
  if (ELYXIR_ID_GROUPS.recipes.has(assetId)) return 'RECIPE';
  return null;
}

export function extractElyxirCollections(accountAssets = []) {
  const buckets = { ingredients: [], tools: [], flasks: [], creations: [], recipes: [] };
  accountAssets.forEach(a => {
    const type = classifyElyxirAsset(a.asset);
    if (type) {
      const key = type.toLowerCase() + (type === 'TOOL' ? 's' : (type.endsWith('N') ? 's' : 's'));
      if (buckets[key]) buckets[key].push(a);
    }
  });
  return buckets;
}

export function getRecentCreations(trades = [], limit = 5) {
  // Filter trades whose asset is a known creation
  return trades.filter(t => ELYXIR_ID_GROUPS.creations.has(t?.asset || t?.assetId)).slice(0, limit);
}

export function getRecentIngredientTrades(trades = [], limit = 5) {
  return trades.filter(t => ELYXIR_ID_GROUPS.ingredients.has(t?.asset || t?.assetId)).slice(0, limit);
}

export function summarizeElyxirPortfolio(buckets) {
  const counts = Object.fromEntries(Object.entries(buckets).map(([k,v]) => [k, v.length]));
  return counts;
}
