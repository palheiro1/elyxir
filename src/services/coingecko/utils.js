export const getIgnisPrice = async () => {
    const responseUSD = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ignis&vs_currencies=usd'
    );
    const data = await responseUSD.json();
    return data.ignis.usd;
}