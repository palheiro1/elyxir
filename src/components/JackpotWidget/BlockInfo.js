import { Center, Table, Tbody, Td, Tr, useColorModeValue } from '@chakra-ui/react';

const BlockInfo = ({ jackpotStatus, jackpotTimer, cStyle = 1 }) => {

    const pyStyle = cStyle === 1 ? 2.5 : 2;
    const textColor = useColorModeValue("black", "white");

    return (
        <Center rounded="lg">
            <Table variant="simple" my={cStyle === 1 && 6} color={textColor} size={cStyle === 1 ? "lg" : "sm"}>
                <Tbody>
                    <Tr>
                        <Td py={pyStyle} borderBottom="0px">
                            Remaining blocks
                        </Td>
                        <Td py={pyStyle} borderBottom="0px" color="gray">
                            {jackpotTimer.remainingBlocks}
                        </Td>
                    </Tr>

                    <Tr>
                        <Td py={pyStyle} borderBottom="0px">
                            Jackpot block
                        </Td>
                        <Td py={pyStyle} borderBottom="0px" color="gray">
                            {jackpotStatus.status.numberOfBlocks + jackpotTimer.remainingBlocks}
                        </Td>
                    </Tr>

                    <Tr>
                        <Td py={pyStyle} borderBottom="0px">
                            Current block
                        </Td>
                        <Td py={pyStyle} borderBottom="0px" color="gray">
                            {jackpotStatus.status.numberOfBlocks}
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </Center>
    );
};

export default BlockInfo;
