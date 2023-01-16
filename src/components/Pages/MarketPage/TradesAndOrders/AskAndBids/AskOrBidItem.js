import { Td, Tr } from '@chakra-ui/react';
import { useState } from 'react';
import TableCard from '../../../../Cards/TableCard';

const AskOrBidItem = ({ order, asset, ignis, amount, isAsk = false, onOpen, setSelectedOrder }) => {

    // ------------------------------------------------------------
    const [hover, setHover] = useState(false);
    // ------------------------------------------------------------

    ignis = Number(ignis);
    const fixedIgnis = Number.isInteger(ignis) ? ignis.toFixed(0) : ignis.toFixed(2);

    // ------------------------------------------------------------
    // Specific asset is a number
    // ------------------------------------------------------------
    if (Number.isInteger(asset)) {
        return (
            <Tr>
                <Td textAlign="center">{fixedIgnis}</Td>
                <Td textAlign="center">{amount}</Td>
            </Tr>
        );
    }

    let card;
    // ------------------------------------------------------------
    // Normal use case
    // ------------------------------------------------------------

    const handleDeleteOrder = () => {
        setSelectedOrder({ order, isAsk });
        onOpen();
    };

    const hoverStyle = {
        opacity: 0.6,
        cursor: 'pointer',
    };

    const normalStyle = {
        opacity: 1,
        cursor: 'none',
    };

    if (asset !== 'GEM') {
        card = (
            <TableCard
                key={asset.asset}
                image={asset.cardImgUrl}
                title={asset.name}
                rarity={asset.rarity}
                continent={asset.channel}
                needDelete={hover ? true : false}
            />
        );
    }

    return (
        <Tr
            style={hover ? hoverStyle : normalStyle}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={handleDeleteOrder}>
            <Td textAlign="center">{asset === 'GEM' ? 'GEM' : card}</Td>
            <Td textAlign="center">{fixedIgnis}</Td>
            <Td textAlign="center">{amount}</Td>
        </Tr>
    );
};

export default AskOrBidItem;
