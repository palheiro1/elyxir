import { Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { Td } from '../../../ResponsiveTable/td';
import { Tr } from '../../../ResponsiveTable/tr';
import InOutTransaction from '../../../Tables/InOutTransaction';

import { FaCoins } from 'react-icons/fa';
import TableCard from '../../../Cards/TableCard';
import GemCard from '../../../Cards/GemCard';
import GIFTZCard from '../../../Cards/GIFTZCard';
import WETHCard from '../../../Cards/WETHCard';

/**
 * @name TradesOrOrderItem
 * @description Component to show the trades or orders - ITEM
 * @param {String} type - Type of transaction
 * @param {String} name - Name of the card
 * @param {Number} amount - Amount of the card
 * @param {Number} price - Price of the card
 * @param {String} date - Date of the transaction
 * @param {String} sellerOrBuyer - Seller or buyer of the card
 * @param {Object} card - Card data
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const TradesOrOrderItem = ({ type, name, amount, price, date, sellerOrBuyer, card }) => {
    const hoverColor = "rgba(59, 100, 151, 0.15)"
    const iconColor = useColorModeValue('blackAlpha.500', 'yellow');

    const isCurrency = name === 'GEM' || name === 'GIFTZ' || name === 'wETH';

    if (card === undefined || card === null) {
        return (
            <Tr _hover={{ bgColor: hoverColor }}>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
                <Td fontWeight="bold" fontSize="xl">
                    {name}
                </Td>
                <Td>{amount}</Td>
                <Td>
                    <Stack direction="row" align="center">
                        <FaCoins color={iconColor} />
                        <Text>{price}</Text>
                    </Stack>
                </Td>
                <Td>{date}</Td>
                <Td>{sellerOrBuyer}</Td>
            </Tr>
        );
    }

    if (isCurrency) {
        return (
            <Tr _hover={{ bgColor: hoverColor }}>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
                <Td fontWeight="bold" fontSize="xl">
                    {name === 'GEM' && <GemCard />}
                    {name === 'GIFTZ' && <GIFTZCard />}
                    {name === 'wETH' && <WETHCard />}
                </Td>
                <Td>{amount}</Td>
                <Td>
                    <Stack direction="row" align="center">
                        <FaCoins color={iconColor} />
                        <Text>{price}</Text>
                    </Stack>
                </Td>
                <Td>{date}</Td>
                <Td>{sellerOrBuyer}</Td>
            </Tr>
        );
    }

    return (
        <Tr _hover={{ bgColor: hoverColor }}>
            <Td>
                <InOutTransaction type={type} />
            </Td>
            <Td>
                <TableCard image={card.cardImgUrl} title={card.name} continent={card.channel} rarity={card.rarity} />
            </Td>
            <Td>{amount}</Td>
            <Td>
                <Stack direction="row" align="center">
                    <FaCoins color={iconColor} />
                    <Text>{price}</Text>
                </Stack>
            </Td>
            <Td>{date}</Td>
            <Td>{sellerOrBuyer}</Td>
        </Tr>
    );
};

export default TradesOrOrderItem;
