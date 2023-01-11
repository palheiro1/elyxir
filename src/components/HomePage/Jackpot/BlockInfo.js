import { Center, Table, Tbody, Td, Tr } from '@chakra-ui/react';

const BlockInfo = ({ jackpotStatus, jackpotTimer }) => {
    return (
        <Center>
            <Table variant="simple" my={6} color="white">
                <Tbody>
                    <Tr>
                        <Td py={2.5} borderBottom="0px">
                            Remaining blocks
                        </Td>
                        <Td py={2.5} borderBottom="0px" color="gray">
                            {jackpotTimer.remainingBlocks}
                        </Td>
                    </Tr>

                    <Tr>
                        <Td py={2.5} borderBottom="0px">
                            Jackpot block
                        </Td>
                        <Td py={2.5} borderBottom="0px" color="gray">
                            {jackpotStatus.status.numberOfBlocks + jackpotTimer.remainingBlocks}
                        </Td>
                    </Tr>

                    <Tr>
                        <Td py={2.5} borderBottom="0px">
                            Current block
                        </Td>
                        <Td py={2.5} borderBottom="0px" color="gray">
                            {jackpotStatus.status.numberOfBlocks}
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </Center>
    );
};

export default BlockInfo;
