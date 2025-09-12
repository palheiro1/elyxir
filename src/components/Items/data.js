export const mediumMapping = {
    1: 'Terrestrial',
    2: 'Aerial',
    3: 'Aquatic',
};

export const domainMapping = {
    1: 'Asia',
    2: 'Oceania',
    3: 'America',
    4: 'Africa',
    5: 'Europe',
};

export const typeMapping = {
    ingredient: 'Crafting Material',
    tool: 'Crafting Tool',
    flask: 'Storage Container',
    recipe: 'Crafting Knowledge',
};

export const getTypeValue = ({ type, value }) => {
    if (type === 'medium') return mediumMapping[value];
    if (type === 'domain') return domainMapping[value];
    if (type === 'ingredient') return 'Ingredient';
    if (type === 'tool') return 'Tool';
    if (type === 'flask') return `${value} Portion${value > 1 ? 's' : ''}`;
    if (type === 'recipe') return 'Recipe';
    return type;
};

export const getMediumColor = medium => {
    const colors = {
        1: 'red',
        2: '#0da1acff',
        3: 'blue',
    };
    return colors[medium] || 'gray';
};

export const getContinentColor = continent => {
    const colors = {
        1: 'orange',
        2: 'teal',
        3: 'purple',
        4: '#f3d111ff',
        5: 'green',
    };
    return colors[continent] || 'gray';
};

export const getColor = (bonus) => {
    if (!bonus || typeof bonus !== 'object') return 'gray';
    const { type, value } = bonus;
    if (type === 'medium') return getMediumColor(value);
    if (type === 'domain') return getContinentColor(value);
    if (type === 'ingredient') return '#8B4513'; // Brown for ingredients
    if (type === 'tool') return '#696969'; // Dark gray for tools  
    if (type === 'flask') return '#4682B4'; // Steel blue for flasks
    if (type === 'recipe') return '#DAA520'; // Goldenrod for recipes
    return 'gray';
};
