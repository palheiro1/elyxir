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

export const getTypeValue = ({ type, value }) => {
    if (type === 'medium') return mediumMapping[value];
    if (type === 'domain') return domainMapping[value];
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

export const getColor = ({ type, value }) => {
    if (type === 'medium') return getMediumColor(value);
    if (type === 'domain') return getContinentColor(value);
};
