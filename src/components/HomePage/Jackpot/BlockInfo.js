import { Box, Table, Td, Tr } from "@chakra-ui/react"

const BlockInfo = () => {
    return (
        <Box minH="160px" minW="325px">
            <Table variant="simple" m={4}>
                <Tr>
                    <Td py={1.5} borderBottom="0px">
                        Remaining blocks
                    </Td>
                    <Td py={1.5} borderBottom="0px">
                        8130
                    </Td>
                </Tr>

                <Tr>
                    <Td py={1.5} borderBottom="0px">
                        Next block in
                    </Td>
                    <Td py={1.5} borderBottom="0px">
                        -7 sec
                    </Td>
                </Tr>

                <Tr>
                    <Td py={1.5} borderBottom="0px">
                        Jackpot block
                    </Td>
                    <Td py={1.5} borderBottom="0px">
                        1567899
                    </Td>
                </Tr>

                <Tr>
                    <Td py={1.5} borderBottom="0px">
                        Current block
                    </Td>
                    <Td py={1.5} borderBottom="0px">
                        1665150
                    </Td>
                </Tr>
            </Table>
        </Box>
    )
}

export default BlockInfo