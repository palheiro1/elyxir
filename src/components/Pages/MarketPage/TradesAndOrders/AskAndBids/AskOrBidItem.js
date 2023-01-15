import { Td, Tr } from '@chakra-ui/react';
import TableCard from '../../../../Cards/TableCard';

const AskOrBidItem = ({ asset, ignis, amount }) => {
    let card;

    if(asset !== "GEM") {
        card = <TableCard
            key={asset.asset}
            image={asset.cardImgUrl}
            title={asset.name}
            rarity={asset.rarity}
            continent={asset.channel}
            />
    }

    return (
        <Tr>
            <Td textAlign="center">
                { asset === "GEM" ? "GEM" : card}
            </Td>
            <Td textAlign="center">{ignis}</Td>
            <Td textAlign="center">{amount}</Td>
        </Tr>
    );
};

export default AskOrBidItem;
