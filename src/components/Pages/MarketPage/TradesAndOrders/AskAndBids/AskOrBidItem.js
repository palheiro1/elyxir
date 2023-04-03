import { Image, Stack, Td, Text, Tr } from '@chakra-ui/react';
import { useState } from 'react';
import { GEMASSET, NQTDIVIDER } from '../../../../../data/CONSTANTS';
import TableCard from '../../../../Cards/TableCard';
import GemCard from '../../../../Cards/GemCard';

/**
 * @name AskOrBidItem
 * @description Item for the ask or bid table
 * @param {Object} order - Order object
 * @param {Number} asset - Asset ID
 * @param {Number} ignis - Price in IGNIS
 * @param {Number} amount - Amount of asset
 * @param {Boolean} isAsk - Is it an ask order?
 * @param {Function} onOpen - Open modal
 * @param {Function} setSelectedOrder - Set selected order (click on orders)
 * @returns {JSX.Element} - JSX to display
 * @author Jesús Sánchez Fernández
 * @version 1.0.0
 */
const AskOrBidItem = ({
    order,
    asset,
    ignis,
    amount,
    isAsk = false,
    onOpen,
    setSelectedOrder,
    onlyOneAsset,
    canDelete = false,
}) => {
    // ------------------------------------------------------------
    const [hover, setHover] = useState(false);
    // ------------------------------------------------------------

    ignis = Number(ignis);
    const fixedIgnis = Number.isInteger(ignis) ? ignis.toFixed(0) : ignis.toFixed(2);

    const isGem = asset === 'GEM' || asset === GEMASSET;

    const name = isGem ? (
        <GemCard hover={hover} />
    ) : (
        <TableCard
            key={asset.asset}
            image={asset.cardImgUrl}
            title={asset.name}
            rarity={asset.rarity}
            continent={asset.channel}
            needDelete={hover ? true : false}
        />
    );

    const showAmount = isGem ? amount / NQTDIVIDER : amount;

    amount = isGem ? Number(amount / NQTDIVIDER) : Number(amount);
    const fixedAmount = Number.isInteger(amount) ? amount.toFixed(0) : amount.toFixed(2);

    const hoverStyle = {
        opacity: 0.6,
        cursor: 'pointer',
        fontWeight: 'bold',
    };

    const normalStyle = {
        opacity: 1,
    };

    const handleDeleteOrder = () => {
        setSelectedOrder({ order, isAsk });
        onOpen();
    };

    const handleSelectOrder = () => {
        setSelectedOrder({ order, isAsk, price: fixedIgnis, quantity: fixedAmount });
    };

    // ------------------------------------------------------------
    // Specific asset is a number
    // ------------------------------------------------------------
    /*
    if (asset === GEMASSET) {
        return (
            <Tr>
                <Td textAlign="center">{fixedIgnis}</Td>
                <Td textAlign="center">{fixedAmount}</Td>
            </Tr>
        );
    }
    */

    // ------------------------------------------------------------
    // Normal use case
    // ------------------------------------------------------------

    return (
        <Tr
            style={hover ? hoverStyle : normalStyle}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={canDelete ? handleDeleteOrder : handleSelectOrder}>
            {!onlyOneAsset && <Td textAlign="center">{name}</Td>}
            <Td textAlign="center">{fixedIgnis}</Td>
            <Td textAlign="center">{showAmount}</Td>
        </Tr>
    );
};

export default AskOrBidItem;
