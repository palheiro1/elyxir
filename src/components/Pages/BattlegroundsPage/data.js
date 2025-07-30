export const GemMode = {
    Withdraw: false,
    Send: true,
};

export const WethMode = {
    Withdraw: false,
    Send: true,
};

export const wEthDecimals = 4;

export const rarityFilterOptions = [
    { name: 'Rarity', value: -1 },
    { name: 'Common', value: 1 },
    { name: 'Rare', value: 2 },
    { name: 'Epic', value: 3 },
    { name: 'Special', value: 4 },
];

export const mediumFilterOptions = [
    { name: 'Element', value: -1 },
    { name: 'Terrestrial', value: 1 },
    { name: 'Aerial', value: 2 },
    { name: 'Aquatic', value: 3 },
];

export const buttonsGroups = [
    {
        title: 'Combat operations',
        color: '#56689F',
        buttons: [
            {
                name: 'Leaderboards',
                modal: 'leaderboards',
                tooltip: "See who's dominating Battlegrounds and track your global rankings",
            },
            {
                name: 'Battle record',
                modal: 'battleRecord',
                tooltip: 'Review your previous fights - victories, defeats and tactical information',
            },
            {
                name: 'Earnings',
                modal: 'earnings',
                tooltip: 'Check the rewards obtained for your battles and the performance of your pantheons',
            },
            {
                name: 'Deploy army',
                modal: 'inventory',
                tooltip: 'Send your creature cards from your NFT wallet to Battlegrounds',
            },
        ],
    },
    {
        title: 'Player settings',
        color: '#7FC0BE',
        buttons: [
            {
                name: 'Quick start',
                modal: 'quickStart',
                tooltip:
                    'Summary of first steps: deploy some cards to Battlegrounds, select a country, build your army, and battle',
            },
            {
                name: 'FAQ',
                action: () => window.open('https://mythicalbeings.io/how-to-play-battlegrounds.html', '_blank'),
                tooltip: 'Learn how the game works',
            },
            {
                name: 'Change name',
                modal: 'name',
                tooltip: 'Customize your in-game name as it appears in the leaderboard and battles',
            },
        ],
    },
    {
        color: '#994068',
        buttons: [
            {
                name: 'Return to wallet',
                action: navigate => navigate('/home'),
                tooltip: 'Back to your NFT portfolio to manage your collection and cards',
            },
        ],
    },
];

export const STUCKED_CARDS_KEY = 'stuckedBattleCards';
