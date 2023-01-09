import { Center, Table, Td, Tr } from "@chakra-ui/react"

const BlockInfo = () => {
    return (
        <Center>
            <Table variant="simple" my={6}>
                <Tr>
                    <Td py={2.5} borderBottom="0px">
                        Remaining blocks
                    </Td>
                    <Td py={2.5} borderBottom="0px" color="gray">
                        8130
                    </Td>
                </Tr>

                <Tr>
                    <Td py={2.5} borderBottom="0px">
                        Next block in
                    </Td>
                    <Td py={2.5} borderBottom="0px" color="gray">
                        -7 sec
                    </Td>
                </Tr>

                <Tr>
                    <Td py={2.5} borderBottom="0px">
                        Jackpot block
                    </Td>
                    <Td py={2.5} borderBottom="0px" color="gray">
                        1567899
                    </Td>
                </Tr>

                <Tr>
                    <Td py={2.5} borderBottom="0px">
                        Current block
                    </Td>
                    <Td py={2.5} borderBottom="0px" color="gray">
                        1665150
                    </Td>
                </Tr>
            </Table>
        </Center>
    )
}

export default BlockInfo