export const formatDate = timestamp => {
    const eb = new Date(Date.UTC(2018, 0, 1, 0, 0, 0));
    let battleStamp = new Date(eb.getTime() + timestamp * 1000);

    // Adding to hours to balance the ARDOR timestamp to GMT+2
    battleStamp = new Date(battleStamp.getTime() + 7200000);

    const hours = battleStamp.getUTCHours().toString().padStart(2, '0');
    const minutes = battleStamp.getUTCMinutes().toString().padStart(2, '0');
    const day = battleStamp.getUTCDate().toString().padStart(2, '0');
    const month = (battleStamp.getUTCMonth() + 1).toString().padStart(2, '0');

    return `${hours}:${minutes} ${day}/${month}`;
};

export function formatAddress(address) {
    let firstPart = address.slice(0, 3);
    let lastPart = address.slice(-5);
    return `${firstPart}...${lastPart}`;
}