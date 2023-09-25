import { Box, Center, Heading, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';

const BridgeSelector = ({ setBridgeType }) => {
    const borderColor = useColorModeValue('#573b97', '#573b97');
    const bgColor = useColorModeValue('rgba(57,59,151,0.5)', 'rgba(57,59,151,0.5)');
    const hoverColor = useColorModeValue('rgba(57,59,151,0.3)', 'rgba(57,59,151,0.3)');

    const lightBgColor = 'rgba(57,59,151,0.15)';

    const BridgeButton = ({ bridgeType, text, description }) => {
        return (
            <Box
                w="100%"
                border="1px"
                borderColor={borderColor}
                bgColor={lightBgColor}
                p={8}
                rounded="md"
                shadow="md"
                minH="5rem"
                onClick={() => setBridgeType(bridgeType)}
                _hover={{ bgColor: hoverColor, cursor: 'pointer' }}>
                <Text fontSize="2xl" fontWeight="medium" textAlign="center" color={borderColor}>
                    {text}
                </Text>
                <Text fontSize={'xs'} mt={2} p={2} w="100%" bgColor={bgColor} rounded="lg" color="white">
                    {description}
                </Text>
            </Box>
        );
    }

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
                <BridgeButton bridgeType="ERC20wETH" text="wETH" description="Bring your wETH to Ardor to buy card packs from the vending machine." />
                <BridgeButton bridgeType="ERC20Mana" text="MANA" description="Bring your MANA to Polygon to exercise your right to vote in the Mythic DAO." />
                <BridgeButton bridgeType="ERC1155GIFTZ" text="GIFTZ" description="Bring your GIFTZ to Ardor to open the 3 random NFT they contain." />
                <BridgeButton bridgeType="ERC20GEM" text="GEM" description="Use the bridge to trade your GEM in Polygon." />
            </SimpleGrid>
            <Box
                w="100%"
                border="1px"
                borderColor={borderColor}
                bgColor={lightBgColor}
                p={8}
                mt={2}
                rounded="md"
                shadow="md"
                minH="5rem"
                onClick={() => setBridgeType('ERC1155')}
                _hover={{ bgColor: hoverColor, cursor: 'pointer' }}>
                <Text fontSize="2xl" fontWeight="medium" textAlign="center" color={borderColor}>
                    CARDs
                </Text>
                <Text fontSize={'xs'} mt={2} p={2} w="100%" bgColor={bgColor} rounded="lg" textAlign="center" color="white">
                    Take your cards to Polygon to sell them on the main NFT marketplaces, or bring them to Ardor to
                    craft, morph, claim jackpots or access unlockable content.
                </Text>
            </Box>
        </>
    );
};

export default BridgeSelector;
