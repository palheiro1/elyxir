import { Stack, Td, Text, Tr } from "@chakra-ui/react";
import InOutTxMarket from "../InOutTxMarket";

import { FaCoins } from "react-icons/fa";
import TableCard from "../../../Cards/TableCard";

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
