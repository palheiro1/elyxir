import { Td, Tr } from '@chakra-ui/react';
import { useState } from 'react';
import { GEMASSET, NQTDIVIDER } from '../../../../../data/CONSTANTS';
import TableCard from '../../../../Cards/TableCard';

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
const AskOrBidItem = ({ order, asset, ignis, amount, isAsk = false, onOpen, setSelectedOrder, onlyOneAsset, canDelete = false }) => {
    // ------------------------------------------------------------
    const [hover, setHover] = useState(false);
    const handleHover = (value) => {
        if(canDelete) {
            setHover(value);
        }
    };
    // ------------------------------------------------------------

    ignis = Number(ignis);
    const fixedIgnis = Number.isInteger(ignis) ? ignis.toFixed(0) : ignis.toFixed(2);

    amount = asset === GEMASSET ? Number(amount / NQTDIVIDER) : Number(amount);
    const fixedAmount = Number.isInteger(amount) ? amount.toFixed(0) : amount.toFixed(2);

    // ------------------------------------------------------------
    // Specific asset is a number
    // ------------------------------------------------------------
    if (asset === GEMASSET) {
        return (
            <Tr>
                <Td textAlign="center">{fixedIgnis}</Td>
                <Td textAlign="center">{fixedAmount}</Td>
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

    const handleSelectOrder = () => {
        setSelectedOrder({ order, isAsk, price: fixedIgnis, quantity: fixedAmount });
    };

    const hoverStyle = {
        opacity: 0.6,
        cursor: 'pointer',
    };

    const normalStyle = {
        opacity: 1,
    };

    // ------------------------------------------------------------

    card = asset !== 'GEM' && (
        <TableCard
            key={asset.asset}
            image={asset.cardImgUrl}
            title={asset.name}
            rarity={asset.rarity}
            continent={asset.channel}
            needDelete={hover ? true : false}
        />
    );

    const name = asset === 'GEM' ? 'GEM' : card;
    const nameHover = hover && asset === 'GEM' ? 'Delete order' : name;
    const showAmount = asset === 'GEM' ? amount / NQTDIVIDER : amount;

    return (
        <Tr
            style={hover ? hoverStyle : normalStyle}
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
            onClick={canDelete ? handleDeleteOrder : handleSelectOrder}>
            {!onlyOneAsset && <Td textAlign="center">{nameHover}</Td> }
            <Td textAlign="center">{fixedIgnis}</Td>
            <Td textAlign="center">{showAmount}</Td>
        </Tr>
    );
};

export default AskOrBidItem;
