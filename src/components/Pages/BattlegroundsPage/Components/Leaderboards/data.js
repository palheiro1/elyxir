import panteon from '../../assets/icons/panteon_banner.svg';
import landsBanner from '../../assets/icons/lands_banner.svg';
import waterBanner from '../../assets/icons/water_banner.svg';
import airBanner from '../../assets/icons/air_banner.svg';
import combativityBanner from '../../assets/icons/combativeness_banner.svg';

export const rewardsTextByType = {
    general: {
        0: 'Top 1 gets 25% tribute, 1 Special Card, and 100 MANA.',
        1: 'Top 2 gets 12.5% tribute, 1 Special Card, and 100 MANA.',
        2: 'Top 3 gets 6.25% tribute, 1 Special Card, and 100 MANA.',
        3: 'Top 4 gets 4% tribute, 1 Special Card, and 100 MANA.',
        4: 'Top 5 gets 2.25% tribute, 1 Special Card, and 100 MANA.',
    },
    aquatic: {
        0: 'Top 1 gets 16% tribute, 1 Special Card, and 200 MANA.',
    },
    terrestrial: {
        0: 'Top 1 gets 16% tribute, 1 Special Card, and 200 MANA.',
    },
    aerial: {
        0: 'Top 1 gets 16% tribute, 1 Special Card, and 200 MANA.',
    },
};

export const TypesLeaderboardsHeaders = [
    {
        label: 'POSITION',
    },
    {
        label: 'NAME/ ADDRESS',
    },
    {
        label: 'CONQUERED LANDS',
        info: 'Number of arenas currently conquered by the player.',
    },
    {
        label: 'CONQUEST POINTS',
        info: 'Points earned by conquering new arenas.',
    },
    {
        label: 'SUCCESSFUL DEFENSES',
        info: 'Points from defending owned arenas successfully.',
    },
    {
        label: 'BATTLE EFFICIENCY',
        info: 'Points based on win/loss ratio in battles.',
    },
    {
        label: 'DEFENSE DURATION',
        info: 'Points based on how long arenas were defended.',
    },
    {
        label: 'TOTAL POINTS',
        info: 'Sum of all earned points in this leaderboard.',
    },
];

export const availableLeaderboards = [
    {
        name: 'CHAMPIONS PANTHEON',
        value: 1,
        description:
            "The players' scores are calculated as the weighted sum of four elements. Each element is normalized using the formula (player score / highest score recorded), ensuring that the weighted value of every metric falls within the range of 0 to 1. Finally, the normalized values are summed to produce the total score, which will always range between 0 and 4.",
    },
    { name: 'TERRESTRIAL PANTHEON', value: 2 },
    { name: 'AERIAL PANTHEON', value: 3 },
    { name: 'AQUATIC PANTHEON', value: 4 },
    {
        name: 'CHAMPION OF FIERCENESS',
        value: 5,
        description:
            '1 point per battle initiated on common territory. 2 points per battle initiated on rare territory. 3 points per battle initiated on epic territory. 4 points per battle initiated on special territory.',
    },
];

export const bannerImages = [panteon, landsBanner, airBanner, waterBanner, combativityBanner];

export const leaderboardsColors = {
    terrestrial: '#866678',
    aquatic: '#393CC1',
    aerial: '#5E67A2',
    combativity: '#FF4B85',
    general: '#FFD900',
};

export const CURRENCY_PRECISION = {
    weth: 4,
    gem: 0,
    mana: 0,
};
