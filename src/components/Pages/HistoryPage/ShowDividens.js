import { Button, Center, TableContainer, Text, useColorModeValue } from '@chakra-ui/react';

import { Table } from '../../ResponsiveTable/table';
import { Tbody } from '../../ResponsiveTable/tbody';
import { Thead } from '../../ResponsiveTable/thead';
import { Tr } from '../../ResponsiveTable/tr';
import { Th } from '../../ResponsiveTable/th';
import { Td } from '../../ResponsiveTable/td';
import { getTxTimestamp } from '../../../utils/txUtils';
import { NQTDIVIDER } from '../../../data/CONSTANTS';
import TableCard from '../../Cards/TableCard';

const ShowDividends = ({ filteredDividends, visibleDividends, setVisibleDividends, epoch_beginning }) => {
    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
    // -------------------------------------------------
    const loadMoreDividends = () => {
        setVisibleDividends(prevVisibleTransactions => prevVisibleTransactions + 10);
    };
    // -------------------------------------------------
    const hoverColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
    return filteredDividends && filteredDividends.length > 0 ? (
        <TableContainer
            border="1px"
            borderColor={borderColor}
            rounded="lg"
            bg="blackAlpha"
            shadow="dark-lg"
            boxShadow="inner"
            textAlign="center"
            maxW={{ base: '100%', md: '80%', lg: '70vw', xl: '100%' }}>
            <Table variant="simple" size={{ base: 'sm', lg: 'md' }}>
                <Thead>
                    <Tr w="1rem">
                        <Th>Title</Th>
                        <Th>Cards owned</Th>
                        <Th>Date and Time</Th>
                        <Th>Dividends received</Th>
                        <Th>Currency</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {filteredDividends.length > 0 &&
                        filteredDividends.slice(0, visibleDividends).map((transaction, index) => {
                            const { card } = transaction;
                            const {
                                cardImgUrl: image,
                                name: title,
                                channel: continent,
                                rarity,
                                unconfirmedQuantityQNT,
                            } = card;
                            const timestamp = getTxTimestamp(transaction, epoch_beginning);
                            const currency = transaction.holdingInfo?.name ? transaction.holdingInfo.name : 'IGNIS';
                            let balance = transaction.change / NQTDIVIDER;
                            balance = balance.toLocaleString('en-US', { maximumFractionDigits: 2 });
                            return (
                                <Tr key={index} _hover={{ bgColor: hoverColor }}>
                                    <Td>
                                        <TableCard image={image} title={title} continent={continent} rarity={rarity} />
                                    </Td>
                                    <Td>{unconfirmedQuantityQNT}</Td>
                                    <Td>{timestamp}</Td>
                                    <Td>{balance}</Td>
                                    <Td>{currency}</Td>
                                </Tr>
                            );
                        })}
                </Tbody>
            </Table>

            {filteredDividends.length > visibleDividends && (
                <Button size="lg" w="100%" p={6} onClick={loadMoreDividends}>
                    Load More
                </Button>
            )}
        </TableContainer>
    ) : (
        <Center w="100%" textAlign="center" py={4} gap={4}>
            <Text fontWeight="bolder" bgGradient="linear(to-l, #478299, #957bd2)" bgClip="text">
                No dividends yet
            </Text>
        </Center>
    );
};

export default ShowDividends;
