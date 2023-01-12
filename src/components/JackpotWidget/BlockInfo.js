import { Center, Table, Tbody, Td, Tr, useColorModeValue } from '@chakra-ui/react';

const BlockInfo = ({ jackpotStatus, jackpotTimer, cStyle }) => {

    const pyStyle = cStyle !== 2 ? 2.5 : 1;
    const textColor = useColorModeValue("black", "white");

    return (
        <Center rounded="lg">
            <Table variant="simple" my={cStyle !== 2 && 6} color={textColor} size={cStyle === 2 && "sm"} >
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
