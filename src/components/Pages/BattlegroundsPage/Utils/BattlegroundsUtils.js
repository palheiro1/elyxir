import { getAsset } from '../../../../services/Ardor/ardorInterface';
import { getAccumulatedBounty, getLeaderboardsRewards } from '../../../../services/Battlegrounds/Battlegrounds';
import { isEmptyObject } from '../../../../utils/utils';

export const formatTimeStamp = timestamp => {
    const eb = new Date(Date.UTC(2018, 0, 1, 0, 0, 0));
    let battleStamp = new Date(eb.getTime() + timestamp * 1000);
    battleStamp = new Date(battleStamp.getTime()).toLocaleString();
    return battleStamp;
};

export const getTimeDifference = (timestamp, getMinSeconds) => {
    const eb = new Date(Date.UTC(2018, 0, 1, 0, 0, 0));

    // Calculate the battle timestamp by adding the given timestamp (in seconds) to the base date
    let battleStamp = new Date(eb.getTime() + timestamp * 1000);

    // Get the current local date and time
    let currentDate = new Date();

    // Calculate the time difference in milliseconds
    let timeDifference = currentDate.getTime() - battleStamp.getTime();

    // Convert the time difference to a human-readable format
    let differenceInSeconds = Math.floor(timeDifference / 1000);
    let differenceInMinutes = Math.floor(differenceInSeconds / 60);
    let differenceInHours = Math.floor(differenceInMinutes / 60);
    let differenceInDays = Math.floor(differenceInHours / 24);

    differenceInSeconds = differenceInSeconds % 60;
    differenceInMinutes = differenceInMinutes % 60;
    differenceInHours = differenceInHours % 24;

    // Create an array to store the parts of the time difference string
    let timeDifferenceArray = [];

    // Only add non-zero parts to the array
    if (differenceInDays > 0) {
        timeDifferenceArray.push(`${differenceInDays} ${differenceInDays !== 1 ? 'days' : 'day'}`);
    }
    if (differenceInHours > 0) {
        timeDifferenceArray.push(`${differenceInHours} ${differenceInHours !== 1 ? 'hours' : 'hour'}`);
    }

    if (getMinSeconds) {
        if (differenceInMinutes > 0) {
            timeDifferenceArray.push(`${differenceInMinutes} ${differenceInMinutes !== 1 ? 'minutes' : 'minute'}`);
        }
        if (differenceInSeconds > 0) {
            timeDifferenceArray.push(`${differenceInSeconds} ${differenceInSeconds !== 1 ? 'seconds' : 'second'}`);
        }
    }

    // Join the array into a single string
    let timeDifferenceString;
    if (timeDifferenceArray.length > 1) {
        timeDifferenceString = timeDifferenceArray.slice(0, -1).join(', ') + ' and ' + timeDifferenceArray.slice(-1);
    } else {
        timeDifferenceString = timeDifferenceArray[0] || (getMinSeconds ? '0 seconds' : 'less than an hour');
    }

    return timeDifferenceString;
};

export const formatDate = dateStr => {
    let [datePart, timePart] = dateStr.split(' ');
    let [day, month, year] = datePart.split('-').map(Number);
    let [hours, minutes, seconds] = timePart.split(':').map(Number);
    let date = new Date(year, month - 1, day, hours, minutes, seconds);

    date.setHours(date.getHours() - 1);

    let newHours = String(date.getHours()).padStart(2, '0');
    let newMinutes = String(date.getMinutes()).padStart(2, '0');
    let newDay = String(date.getDate()).padStart(2, '0');
    let newMonth = String(date.getMonth() + 1).padStart(2, '0');

    return `${newHours}:${newMinutes} ${newDay}/${newMonth}`;
};

export const formatAddress = address => {
    let firstPart = address.slice(0, 3);
    let lastPart = address.slice(-5);
    return `${firstPart}...${lastPart}`;
};

export const getBattleRoundInfo = (defenderAsset, attackerAsset, cards, battleInfo, soldiers) => {
    let attackerCard = cards.find(card => {
        return card.asset === String(attackerAsset);
    });

    let defenderCard = cards.find(card => {
        return card.asset === String(defenderAsset);
    });

    let defenderSoldier = soldiers.find(soldier => soldier.asset === defenderAsset);
    let attackerSoldier = soldiers.find(soldier => soldier.asset === attackerAsset);

    let attackerTotalPower = battleInfo.attacker.find(soldier => soldier.asset === attackerAsset).power;

    let defenderTotalPower = battleInfo.defender.find(soldier => soldier.asset === defenderAsset).power;

    return {
        attackerCard,
        defenderCard,
        defenderSoldier,
        attackerSoldier,
        attackerTotalPower,
        defenderTotalPower,
    };
};

/**
 * @name getLevelIconString
 * @description Returns the image path for a given rarity level (by string name).
 * @param {string} value - Rarity level ("Common", "Rare", "Epic", "Special").
 * @returns {string|null} The corresponding image path or null if not found.
 * @example getLevelIconString("Epic") => "/images/battlegrounds/rarity/epic.png"
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const getLevelIconString = value => {
    let path = '/images/battlegrounds/rarity/';
    switch (value) {
        case 'Common':
            return `${path}common.png`;
        case 'Rare':
            return `${path}rare.png`;
        case 'Epic':
            return `${path}epic.png`;
        case 'Special':
            return `${path}special.png`;
        default:
            return null;
    }
};

/**
 * @name getLevelIconInt
 * @description Returns the image path for a given rarity level (by numeric ID).
 * @param {number} value - Rarity ID (1 = Common, 2 = Rare, 3 = Epic, 4 = Special).
 * @returns {string|null} The corresponding image path or null if not found.
 * @example getLevelIconInt(2) => "/images/battlegrounds/rarity/rare.png"
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const getLevelIconInt = value => {
    let path = '/images/battlegrounds/rarity/';
    switch (value) {
        case 1:
            return `${path}common.png`;
        case 2:
            return `${path}rare.png`;
        case 3:
            return `${path}epic.png`;
        case 4:
            return `${path}special.png`;
        default:
            return null;
    }
};

/**
 * @name getMediumIcon
 * @description Returns the image path for a given medium type (by string name).
 * @param {string} value - Medium type name ("Aquatic", "Aerial", or "Terrestrial").
 * @returns {string|null} The corresponding image path or null if not found.
 * @example getMediumIcon("Aquatic") => "/images/battlegrounds/medium/water.png"
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const getMediumIcon = value => {
    let path = '/images/battlegrounds/medium/';
    switch (value) {
        case 'Aquatic':
            return `${path}water.png`;
        case 'Aerial':
            return `${path}air.png`;
        case 'Terrestrial':
            return `${path}earth.png`;
        default:
            return null;
    }
};

/**
 * @name getDiceIcon
 * @description Returns the image path for a dice icon given a number from 1 to 6.
 * @param {number} value - Dice number (integer between 1 and 6).
 * @returns {string|null} The corresponding dice image path or null if invalid.
 * @example getDiceIcon(3) => "/images/cards/dices/dice3.png"
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const getDiceIcon = value => {
    let path = '/images/cards/dices/';
    if (value < 1 || value > 6 || !value) return null;
    return `${path}dice${value}.png`;
};

/**
 * @name getMediumIconInt
 * @description Returns the image path for a given medium type (by numeric ID).
 * @param {number} value - Medium type ID (1 = Terrestrial, 2 = Aerial, 3 = Aquatic).
 * @returns {string|null} The corresponding image path or null if not found.
 * @example getMediumIconInt(2) => "/images/battlegrounds/medium/air.png"
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const getMediumIconInt = value => {
    let path = '/images/battlegrounds/medium/';
    switch (value) {
        case 1:
            return `${path}earth.png`;
        case 2:
            return `${path}air.png`;
        case 3:
            return `${path}water.png`;
        default:
            return null;
    }
};

/**
 * @name getContinentIcon
 * @description Returns the image path for a given continent name.
 * @param {string} value - Continent name ("Europe", "Asia", "Africa", "America", "Oceania").
 * @returns {string|null} The corresponding image path or null if not found.
 * @example getContinentIcon("Europe") => "/images/battlegrounds/continent/europa.png"
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const getContinentIcon = value => {
    let path = '/images/battlegrounds/continent/';
    switch (value) {
        case 'Europe':
            return `${path}europa.png`;
        case 'Asia':
            return `${path}asia.png`;
        case 'Africa':
            return `${path}africa.png`;
        case 'America':
            return `${path}america.png`;
        case 'Oceania':
            return `${path}oceania.png`;
        default:
            return null;
    }
};

/**
 * @name formatLeaderboardRewards
 * @description
 * Formats and calculates the leaderboard rewards based on the selected leaderboard type.
 * Fetches the current accumulated bounty and static reward configuration, merges the data
 * with asset details, and returns the reward structure including cards, mana, wETH and GEM.
 * Option modes:
 * - `1` (default): General Leaderboard rewards with tribute percentages applied.
 * - `'gen'`: General Leaderboard rewards without applying tribute percentages.
 * - Any other value: Terrestrial Leaderboard Top 1 rewards with tribute percentages.
 *
 * @param {number|string} [option=1] - Selector for the type of reward formatting to return.
 * @returns {Promise<Object|undefined>} Object with formatted rewards:
 *  {
 *    cards: number,
 *    mana: number,
 *    weth: number,
 *    gem: number
 *  }
 * Returns `undefined` if data is incomplete or unavailable.
 * @example
 * const rewards = await formatLeaderboardRewards(); // General with tribute %
 * const rewards = await formatLeaderboardRewards('gen'); // General without tribute
 * const rewards = await formatLeaderboardRewards(2); // Terrestrial Top 1
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const formatLeaderboardRewards = async (option = 1) => {
    const accumulatedBounty = await getAccumulatedBounty();
    const rewards = await getLeaderboardsRewards();

    if (accumulatedBounty && !isEmptyObject(accumulatedBounty) && rewards && !isEmptyObject(rewards)) {
        const results = await fetchAssetsWithPricing(accumulatedBounty.asset);

        const getPrice = name => Number(results.find(item => item.name === name)?.price || 0);
        const genPercentage = rewards.general.totalRewards.tributePercentage;
        const terPercentage = rewards.terrestrial.top1.tributePercentage;

        switch (option) {
            case 1:
                return {
                    cards: rewards.general.totalRewards.specialCards,
                    mana: rewards.general.totalRewards.manaQNT,
                    weth: getPrice('wETH') * genPercentage,
                    gem: getPrice('GEM') * genPercentage,
                };
            case 'gen':
                return {
                    cards: rewards.general.totalRewards.specialCards,
                    mana: rewards.general.totalRewards.manaQNT,
                    weth: getPrice('wETH'),
                    gem: getPrice('GEM'),
                };
            default:
                return {
                    cards: rewards.terrestrial.top1.specialCards,
                    mana: rewards.terrestrial.top1.manaQNT,
                    weth: getPrice('wETH') * terPercentage,
                    gem: getPrice('GEM') * terPercentage,
                };
        }
    }
};

export const getCurrencyImage = key => {
    const path = 'images/currency/';
    switch (key) {
        case 'weth':
            return `${path}weth.png`;
        case 'gem':
            return `${path}gem.png`;
        case 'mana':
            return `${path}mana.png`;
        case 'cards':
            return '/images/battlegrounds/SUMANGA.svg';
        default:
            return null;
    }
};

/**
 * @name getCapturedCardText
 * @description Determines the appropriate label text for the captured or obtained card, based on whether
 * the current user was defending and whether the defender won.
 * @param {boolean} isUserDefending - Whether the current user is the defender.
 * @param {boolean} isDefenderWin - Whether the defender won the battle.
 * @returns {string} The appropriate label text for the captured or obtained card.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const getCapturedCardText = (isUserDefending, isDefenderWin) => {
    if (isUserDefending) {
        return isDefenderWin ? 'OBTAINED CARD:' : 'CAPTURED CARD: ';
    }
    return isDefenderWin ? 'CAPTURED CARD:' : 'OBTAINED CARD: ';
};

/**
 * @name fetchAssetsWithPricing
 * @description Enriches a plain asset-price object with asset details fetched asynchronously.
 * @param {Record<string, any>} assetMap - An object where keys are asset IDs and values are prices.
 * @returns {Promise<Array<{ name: string, price: number }>>} Enriched assets with details and price.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company.
 */
export const fetchAssetsWithPricing = async (assetMap = {}) => {
    if (!assetMap || Object.keys(assetMap).length === 0) return [];

    const entries = Object.entries(assetMap);
    const enriched = await Promise.all(
        entries.map(async ([assetId, price]) => {
            const details = await getAsset(assetId);
            return { ...details, price };
        })
    );

    return enriched;
};

/**
 * @name applyCardSwapUpdates
 * @description Applies quantity updates to a list of cards based on a list of swap changes.
 * @param {Array} cards - The original list of cards to be updated.
 * @param {Array} cardsToSwap - List of cards with swap instructions (must include asset and quantity).
 * @param {boolean} reverse - If true, reverses the update (adds to quantityQNT, subtracts from omnoQuantity).
 * @returns {Array} The updated list of cards.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const applyCardSwapUpdates = (cards, cardsToSwap, reverse = false) => {
    return cards.map(card => {
        const match = cardsToSwap.find(c => c.asset === card.asset);
        if (!match) return card;

        const quantity = match.quantity;
        const quantityQNT = Number(card.quantityQNT || 0);
        const omnoQuantity = Number(card.omnoQuantity || 0);

        const updated = reverse
            ? {
                  quantityQNT: quantityQNT + quantity,
                  omnoQuantity: Math.max(0, omnoQuantity - quantity),
              }
            : {
                  quantityQNT: Math.max(0, quantityQNT - quantity),
                  omnoQuantity: omnoQuantity + quantity,
              };

        return {
            ...card,
            quantityQNT: updated.quantityQNT.toString(),
            omnoQuantity: updated.omnoQuantity.toString(),
        };
    });
};

/**
 * @name mergeUpdatedCards
 * @description Merges updated cards into the original list, overriding matched cards by asset.
 * @param {Array} originalCards - The original array of cards.
 * @param {Array} updatedCards - The array of cards with updated values.
 * @returns {Array} The merged array of cards.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const mergeUpdatedCards = (originalCards, updatedCards) => {
    return originalCards.map(card => {
        const updated = updatedCards.find(c => c.asset === card.asset);
        return updated ?? card;
    });
};
