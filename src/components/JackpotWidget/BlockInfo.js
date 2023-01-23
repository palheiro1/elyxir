import { Center, Table, Tbody, Td, Tr, useColorModeValue } from '@chakra-ui/react';


/**
 * @name BlockInfo
 * @description Component to show the block info of the jackpot
 * @param {Object} jackpotStatus - Jackpot status
 * @param {Object} jackpotTimer - Jackpot timer
 * @param {Number} cStyle - Style of the component
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const BlockInfo = ({ jackpotStatus, jackpotTimer, cStyle = 1 }) => {

    const pyStyle = 3;
    const textColor = useColorModeValue("black", "white");

    return (
        <Center rounded="lg">
            <Table variant="simple" my={cStyle === 1 && 6} color={textColor} size={cStyle === 1 ? "lg" : "sm"}>
                <Tbody>
                    <Tr>
                        <Td py={pyStyle} borderBottom="0px" color="white">
                            Remaining blocks
                        </Td>
                        <Td py={pyStyle} borderBottom="0px" color="gray">
                            {jackpotTimer.remainingBlocks}
                        </Td>
                    </Tr>

                    <Tr>
                        <Td py={pyStyle} borderBottom="0px" color="white">
                            Jackpot block
                        </Td>
                        <Td py={pyStyle} borderBottom="0px" color="gray">
                            {jackpotStatus.status.numberOfBlocks + jackpotTimer.remainingBlocks}
                        </Td>
                    </Tr>

                    <Tr>
                        <Td py={pyStyle} borderBottom="0px" color="white">
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
