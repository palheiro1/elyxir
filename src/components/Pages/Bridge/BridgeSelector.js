import { Box, Center, Stack, Text, useColorModeValue } from '@chakra-ui/react';

const BridgeSelector = ({ setBridgeType }) => {
    const borderColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
    const hoverColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

    return (
        <>
            <Center>
                <Text my={4} fontWeight="bold">
                    Select bridge
                </Text>
            </Center>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={2} align="center">
                <Box
                    w="100%"
                    border="1px"
                    borderColor={borderColor}
                    p={8}
                    rounded="md"
                    shadow="md"
                    minH="5rem"
                    onClick={() => setBridgeType('ERC20')}
                    _hover={{ bgColor: hoverColor, cursor: 'pointer' }}>
                    <Text fontSize="2xl" fontWeight="medium" textAlign="center">
                        wETH
                    </Text>
                    <Text fontSize="sm" fontWeight="light" textAlign="center">
                        (ERC-20)
                    </Text>
                </Box>
                <Box
                    w="100%"
                    border="1px"
                    borderColor={borderColor}
                    p={8}
                    rounded="md"
                    shadow="md"
                    minH="5rem"
                    onClick={() => setBridgeType('ERC1155')}
                    _hover={{ bgColor: hoverColor, cursor: 'pointer' }}>
                    <Text fontSize="2xl" fontWeight="medium" textAlign="center" h="100%">
                        Cards
                    </Text>
                    <Text fontSize="sm" fontWeight="light" textAlign="center">
                        (ERC-1155)
                    </Text>
                </Box>
            </Stack>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={2} align="center" mt={2}>
                <Box
                    w="100%"
                    border="1px"
                    borderColor={borderColor}
                    p={8}
                    rounded="md"
                    shadow="md"
                    minH="5rem"
                    onClick={() => setBridgeType('ERC1155GIFTZ')}
                    _hover={{ bgColor: hoverColor, cursor: 'pointer' }}>
                    <Text fontSize="2xl" fontWeight="medium" textAlign="center" h="100%">
                        GIFTZ
                    </Text>
                    <Text fontSize="sm" fontWeight="light" textAlign="center">
                        (ERC-1155)
                    </Text>
                </Box>
                <Box
                    w="100%"
                    border="1px"
                    borderColor={borderColor}
                    p={8}
                    rounded="md"
                    shadow="md"
                    minH="5rem"
                    onClick={() => setBridgeType('OLD')}
                    _hover={{ bgColor: hoverColor, cursor: 'pointer' }}>
                    <Text fontSize="2xl" fontWeight="medium" textAlign="center" h="100%">
                        Old card bridge
                    </Text>
                    <Text fontSize="sm" fontWeight="light" textAlign="center">
                        (Only to Ardor)
                    </Text>
                </Box>
            </Stack>
        </>
    );
};

export default BridgeSelector;
