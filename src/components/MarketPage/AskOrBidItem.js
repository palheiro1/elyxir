import { Td, Tr } from "@chakra-ui/react";

const AskOrBidItem = ({ asset, ignis, amount }) => {
    return (
        <Tr>
            <Td textAlign="center">{asset}</Td>
            <Td textAlign="center">{ignis}</Td>
            <Td textAlign="center">{amount}</Td>
        </Tr>
    );
};

export default AskOrBidItem;
