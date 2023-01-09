import { Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react"
import { GiCutDiamond } from "react-icons/gi"

const Countdown = () => {
    return (
        <Box>
            <HStack mr={6} my={6}>
                <IconButton icon={<GiCutDiamond />} size="xl" p={4} mr={2} fontSize="4xl" bg="whiteAlpha.100" />
                <VStack align="flex-start">
                    <Text fontSize="3xl" fontWeight="bold" mb={-3}>3581.23 IGNIS</Text>
                    <Text fontSize="md">(215.60 USD)</Text>
                </VStack>
            </HStack>
            <HStack spacing={4}>
                <Box p={2} bg="#121D31" rounded="lg" minW="60px">
                    <Text textAlign="center" fontSize="lg" fontWeight="bold">5</Text>
                    <Text textAlign="center" fontSize="xs">days</Text>
                </Box>

                <Box p={2} bg="#121D31" rounded="lg" minW="60px">
                    <Text textAlign="center" fontSize="lg" fontWeight="bold">15</Text>
                    <Text textAlign="center" fontSize="xs">hours</Text>
                </Box>

                <Box p={2} bg="#121D31" rounded="lg" minW="60px">
                    <Text textAlign="center" fontSize="lg" fontWeight="bold">24</Text>
                    <Text textAlign="center" fontSize="xs">minutes</Text>
                </Box>

                <Box p={2} bg="#121D31" rounded="lg" minW="60px">
                    <Text textAlign="center" fontSize="lg" fontWeight="bold">5</Text>
                    <Text textAlign="center" fontSize="xs">seconds</Text>
                </Box>
            </HStack>
        </Box>
    )
}

export default Countdown