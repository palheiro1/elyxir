export const getMediumColor = medium => {
    const colors = {
        Terrestrial: 'red',
        Aerial: 'cyan',
        Aquatic: 'blue',
    };
    return colors[medium] || 'gray';
};

export const getContinentColor = continent => {
    const colors = {
        Asia: 'orange',
        Europe: 'green',
        Africa: 'yellow',
        America: 'purple',
        Oceania: 'teal',
    };
    return colors[continent] || 'gray';
};

export const mockPotions = [
    {
        id: 'pot1',
        name: 'Lava Elixir',
        image: '/images/items/Lava copia.png',
        medium: 'Terrestrial',
        type: 'Buff',
        description: '+1 Power to Terrestrial creatures',
        quantity: 3,
        bonus: { medium: 'Terrestrial', value: 1 },
    },
    {
        id: 'pot2',
        name: 'Wind Essence',
        image: '/images/items/Wind copia.png',
        medium: 'Aerial',
        type: 'Buff',
        description: '+1 Power to Aerial creatures',
        quantity: 2,
        bonus: { medium: 'Aerial', value: 1 },
    },
    {
        id: 'pot3',
        name: 'Aquatic Essence',
        image: '/images/items/Water sea.png',
        medium: 'Aquatic',
        type: 'Buff',
        description: '+1 Power to Aquatic creatures',
        quantity: 2,
        bonus: { medium: 'Aquatic', value: 1 },
    },
    {
        id: 'pot4',
        name: 'Blood of Asia',
        image: '/images/items/Blood copia.png',
        continent: 'Asia',
        type: 'Buff',
        description: '+1 Power to Asia creatures',
        quantity: 1,
        bonus: { continent: 'Asia', value: 1 },
    },
    {
        id: 'pot5',
        name: 'Sacred Water',
        image: '/images/items/Holi Water2 copia.png',
        type: 'Buff',
        description: '+1 Power to all creatures',
        quantity: 1,
        bonus: { universal: true, value: 1 },
    },
    {
        id: 'pot6',
        name: 'Crystal Water',
        image: '/images/items/WaterCristaline copia.png',
        medium: 'Aquatic',
        type: 'Buff',
        description: '+1 Power to Aquatic creatures',
        quantity: 4,
        bonus: { medium: 'Aquatic', value: 1 },
    },
];
