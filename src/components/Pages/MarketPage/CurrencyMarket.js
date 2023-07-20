import GemWidget from './GemWidget';

const CurrencyMarket = ({ username, gemCards, IGNISBalance, market }) => {
    return <GemWidget username={username} gemCards={gemCards} IGNISBalance={IGNISBalance} market={market} />;
};

export default CurrencyMarket;
