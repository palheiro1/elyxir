import { Stack, Td, Text, Tr } from "@chakra-ui/react";
import InOutTxMarket from "../InOutTxMarket";

import { FaCoins } from "react-icons/fa";
import TableCard from "../../../Cards/TableCard";


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
    if(card === "GEM" || card === undefined) {
        return (
            <Tr>
                <Td><InOutTxMarket type={type} /></Td>
                <Td fontWeight="bold" fontSize="xl">{name}</Td>
                <Td>{amount}</Td>
                <Td>
                    <Stack direction="row" align="center">
                        <FaCoins color="yellow" />
                        <Text>{price}</Text>
                    </Stack>
                </Td>
                <Td>{date}</Td>
                <Td>{sellerOrBuyer}</Td>
            </Tr>
        );
    }
    return (
        <Tr>
            <Td><InOutTxMarket type={type} /></Td>
            <Td>
                <TableCard
                    image={card.cardImgUrl}
                    title={card.name}
                    continent={card.channel}
                    rarity={card.rarity}
                />
            </Td>
            <Td>{amount}</Td>
            <Td>
                <Stack direction="row" align="center">
                    <FaCoins color="yellow" />
                    <Text>{price}</Text>
                </Stack>
            </Td>
            <Td>{date}</Td>
            <Td>{sellerOrBuyer}</Td>
        </Tr>
    );
};

export default TradesOrOrderItem;
