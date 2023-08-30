import { Box, Center, Stack, Text, useColorModeValue } from '@chakra-ui/react';

const BridgeSelector = ({ setBridgeType }) => {
    const borderColor = useColorModeValue('blackAlpha.600', '#573b97');
    const bgColor = useColorModeValue('blackAlpha.600', 'rgba(57,59,151,0.5)');
    const hoverColor = useColorModeValue('blackAlpha.200', 'rgba(57,59,151,0.7)');

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
                    bgColor={bgColor}
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
                </Box>
                <Box
                    w="100%"
                    border="1px"
                    bgColor={bgColor}
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
                </Box>
                <Box
                    w="100%"
                    border="1px"
                    bgColor={bgColor}
                    borderColor={borderColor}
                    p={8}
                    rounded="md"
                    shadow="md"
                    minH="5rem"
                    onClick={() => setBridgeType('ERC20GEM')}
                    _hover={{ bgColor: hoverColor, cursor: 'pointer' }}>
                    <Text fontSize="2xl" fontWeight="medium" textAlign="center" h="100%">
                        GEM
                    </Text>
                </Box>
            </Stack>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={2} align="center" mt={2}>
                <Box
                    w="100%"
                    border="1px"
                    bgColor={bgColor}
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
                </Box>

                <Box
                    w="100%"
                    bgColor={bgColor}
                    border="1px"
                    borderColor={borderColor}
                    p={8}
                    rounded="md"
                    shadow="md"
                    minH="5rem"
                    onClick={() => setBridgeType('OLD')}
                    _hover={{ bgColor: hoverColor, cursor: 'pointer' }}>
                    <Text fontSize="2xl" fontWeight="medium" textAlign="center" h="100%">
                        Old card bridge <small>(Only to ardor)</small>
                    </Text>
                </Box>
            </Stack>
        </>
    );
};

export default BridgeSelector;
