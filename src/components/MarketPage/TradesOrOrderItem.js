import { Stack, Td, Text, Tr } from "@chakra-ui/react";
import InOutTxMarket from "./InOutTxMarket";

import { FaCoins } from "react-icons/fa";

const TradesOrOrderItem = ({ type, name, amount, price, date, sellerOrBuyer }) => {
    return (
        <Tr>
            <Td><InOutTxMarket type={type} /></Td>
            <Td>{name}</Td>
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
