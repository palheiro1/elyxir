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
        timeDifferenceString = timeDifferenceArray[0] || '0 seconds';
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

export const isEmptyObject = object => {
    if (Object.keys(object).length === 0 && object.constructor === Object) return true;
    return false;
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

export const capitalize = string => {
    if (string.length === 0) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getLevelIconString = value => {
    let path = '/images/cards/rarity/';
    switch (value) {
        case 'Common':
            return `${path}common.svg`;
        case 'Rare':
            return `${path}rare.svg`;
        case 'Epic':
            return `${path}epic.svg`;
        case 'Special':
            return `${path}special.svg`;
        default:
            return null;
    }
};

export const getLevelIconInt = value => {
    let path = '/images/cards/rarity/';
    switch (value) {
        case 1:
            return `${path}common.svg`;
        case 2:
            return `${path}rare.svg`;
        case 3:
            return `${path}epic.svg`;
        case 4:
            return `${path}special.svg`;
        default:
            return null;
    }
};

export const getMediumIcon = value => {
    let path = '/images/cards/type/';
    switch (value) {
        case 'Aquatic':
            return `${path}water.svg`;
        case 'Aerial':
            return `${path}air.svg`;
        case 'Terrestrial':
            return `${path}earth.svg`;
        default:
            return null;
    }
};

export const getMediumIconInt = value => {
    let path = '/images/cards/type/';
    switch (value) {
        case 1:
            return `${path}earth.svg`;
        case 2:
            return `${path}air.svg`;
        case 3:
            return `${path}water.svg`;
        default:
            return null;
    }
};

export const getContinentIcon = value => {
    let path = '/images/cards/continent/old/';
    switch (value) {
        case 'Europe':
            return `${path}europa.svg`;
        case 'Asia':
            return `${path}asia.svg`;
        case 'Africa':
            return `${path}africa.svg`;
        case 'America':
            return `${path}america.svg`;
        case 'Oceania':
            return `${path}oceania.svg`;
        default:
            return null;
    }
};
