import { Box, Center, Heading, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';

const BridgeSelector = ({ setBridgeType }) => {
    const borderColor = useColorModeValue('blackAlpha.600', '#573b97');
    const bgColor = useColorModeValue('blackAlpha.600', 'rgba(57,59,151,0.5)');
    const hoverColor = useColorModeValue('blackAlpha.200', 'rgba(57,59,151,0.7)');

    return (
        <>
            <Center>
                <Box mb={2}>
                    <Heading fontSize="3xl" fontWeight="light">
                        Select <strong>bridge</strong>
                    </Heading>
                    <Text fontWeight="thin" fontSize="sm" textAlign="center">
                        CHAIN: POLYGON
                    </Text>
                </Box>
            </Center>
            <SimpleGrid columns={2} spacing={2} align="center">
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
                        wETH / MANA
                    </Text>
                    <Text fontSize={'xs'} mt={2} p={2} w="100%" bgColor={bgColor} rounded="lg" textAlign="left">
                        wETH is the most widely used cryptocurrency on web3 and is used to buy random packs of Mythical
                        Beings cards. <br />
                        MANA is the governance token of the Mythic DAO, the user organisation for this set.
                        <br />
                        You can trade MANA in Ardor, but to use it in the DAO, you must bridge it and store it in
                        Polygon.
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
                    onClick={() => setBridgeType('ERC1155GIFTZ')}
                    _hover={{ bgColor: hoverColor, cursor: 'pointer' }}>
                    <Text fontSize="2xl" fontWeight="medium" textAlign="center">
                        GIFTZ
                    </Text>
                    <Text fontSize={'xs'} mt={2} p={2} w="100%" bgColor={bgColor} rounded="lg" textAlign="left">
                        GIFTZ are a sealed pack of cards. The are sold from a vending machine that is refilled every
                        day.
                        <br /> They can also be bought and sold on the secondary market, both on Ardor and Polygon.
                        <br /> When you open a GIFTZ, you lose it in exchange for three random cards.
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
                    onClick={() => setBridgeType('ERC20GEM')}
                    _hover={{ bgColor: hoverColor, cursor: 'pointer' }}>
                    <Text fontSize="2xl" fontWeight="medium" textAlign="center">
                        GEM
                    </Text>
                    <Text fontSize={'xs'} mt={2} p={2} w="100%" bgColor={bgColor} rounded="lg" textAlign="left">
                        GIFTZ are a sealed pack of cards. The are sold from a vending machine that is refilled every
                        day.
                        <br /> They can also be bought and sold on the secondary market, both on Ardor and Polygon.
                        <br /> When you open a GIFTZ, you lose it in exchange for three random cards.
                    </Text>
                </Box>
                <Box
                    w="100%"
                    border="1px"
                    borderColor={borderColor}
                    p={8}
                    mt={2}
                    rounded="md"
                    shadow="md"
                    minH="5rem"
                    onClick={() => setBridgeType('ERC1155')}
                    _hover={{ bgColor: hoverColor, cursor: 'pointer' }}>
                    <Text fontSize="2xl" fontWeight="medium" textAlign="center">
                        CARDs
                    </Text>
                    <Text fontSize={'xs'} mt={2} p={2} w="100%" bgColor={bgColor} rounded="lg" textAlign="left">
                        GIFTZ are a sealed pack of cards. The are sold from a vending machine that is refilled every
                        day.
                        <br /> They can also be bought and sold on the secondary market, both on Ardor and Polygon.
                        <br /> When you open a GIFTZ, you lose it in exchange for three random cards.
                    </Text>
                </Box>
            </SimpleGrid>
        </>
    );
};

export default BridgeSelector;
