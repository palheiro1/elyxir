import { useState } from 'react';
import { 
    Box, 
    Center, 
    Heading, 
    SimpleGrid, 
    Text, 
    useColorModeValue,
    VStack,
    HStack,
    Icon,
    Button
} from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { FaGem, FaFlask } from 'react-icons/fa';

// Import existing bridge components
import BridgeERC20GEM from './ERC20GEM/BridgeERC20GEM';
import BridgeERC1155Items from './ERC1155Items/BridgeERC1155Items';

/**
 * @name Bridge
 * @description Elyxir-focused Bridge page for GEM and Items only
 * @returns {JSX.Element} - JSX element
 */
const Bridge = ({ infoAccount, gemCards, cards }) => {
    const [selectedBridgeType, setSelectedBridgeType] = useState(null);
    
    const borderColor = useColorModeValue('#573b97', '#573b97');
    const buttonColor = useColorModeValue('#573b97', 'white');
    const hoverColor = useColorModeValue('rgba(57,59,151,0.3)', 'rgba(57,59,151,0.3)');
    const lightBgColor = 'rgba(57,59,151,0.35)';

    // Mock swap addresses for bridge components
    const swapAddresses = {
        eth: '0x1234567890abcdef1234567890abcdef12345678', // Mock ETH address
        ardor: 'ARDOR-ABC123-DEF456-GHI789' // Mock Ardor address
    };

    // Ensure items have proper structure for bridge components
    const bridgeItems = (cards || []).map(item => ({
        ...item,
        quantity: item.quantity || 1,
        quantityQNT: item.quantity || 1,
        id: item.id || item.name,
        name: item.name || 'Unknown Item',
        imgUrl: item.imgUrl || item.img,
        description: item.description || 'Elyxir item'
    }));

    const BridgeButton = ({ bridgeType, text, description, icon }) => {
        return (
            <Box
                w="100%"
                border="2px"
                borderColor={borderColor}
                bgColor={lightBgColor}
                p={{ base: 4, lg: 6 }}
                rounded="xl"
                shadow="lg"
                minH="8rem"
                onClick={() => setSelectedBridgeType(bridgeType)}
                _hover={{ 
                    bgColor: hoverColor, 
                    cursor: 'pointer',
                    transform: 'translateY(-2px)',
                    shadow: 'xl'
                }}
                transition="all 0.2s">
                <VStack spacing={3}>
                    <Icon as={icon} boxSize={8} color={buttonColor} />
                    <Text fontSize="2xl" fontWeight="bold" textAlign="center" color={buttonColor}>
                        {text}
                    </Text>
                    <Text fontSize="sm" textAlign="center" color="white" px={2}>
                        {description}
                    </Text>
                </VStack>
            </Box>
        );
    };

    if (selectedBridgeType === 'GEM') {
        return (
            <Box>
                <HStack mb={6} spacing={3}>
                    <Button
                        leftIcon={<ArrowLeftIcon />}
                        variant="ghost"
                        color={buttonColor}
                        onClick={() => setSelectedBridgeType(null)}
                        _hover={{ bgColor: lightBgColor }}
                    >
                        Back to Bridge
                    </Button>
                </HStack>
                <BridgeERC20GEM 
                    infoAccount={infoAccount} 
                    swapAddresses={swapAddresses}
                    gemCards={gemCards || []}
                />
            </Box>
        );
    }

    if (selectedBridgeType === 'ITEMS') {
        return (
            <Box>
                <HStack mb={6} spacing={3}>
                    <Button
                        leftIcon={<ArrowLeftIcon />}
                        variant="ghost"
                        color={buttonColor}
                        onClick={() => setSelectedBridgeType(null)}
                        _hover={{ bgColor: lightBgColor }}
                    >
                        Back to Bridge
                    </Button>
                </HStack>
                <BridgeERC1155Items 
                    infoAccount={infoAccount} 
                    swapAddresses={swapAddresses}
                    items={bridgeItems}
                />
            </Box>
        );
    }

    return (
        <Box maxW="4xl" mx="auto" p={4}>
            <Center mb={8}>
                <VStack spacing={2}>
                    <Heading fontSize="4xl" fontWeight="light" textAlign="center">
                        Elyxir <strong>Bridge</strong>
                    </Heading>
                    <Text fontWeight="light" fontSize="lg" textAlign="center" color="gray.400">
                        Transfer your assets between Ardor and Polygon
                    </Text>
                    <Text fontWeight="thin" fontSize="sm" textAlign="center" color="gray.500">
                        SUPPORTED CHAINS: ARDOR ↔ POLYGON
                    </Text>
                </VStack>
            </Center>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} maxW="2xl" mx="auto">
                <BridgeButton
                    bridgeType="GEM"
                    text="GEM Currency"
                    description="Bridge your GEM tokens between Ardor and Polygon networks for trading and gameplay"
                    icon={FaGem}
                />
                <BridgeButton
                    bridgeType="ITEMS"
                    text="Elyxir Items"
                    description="Transfer your potions, ingredients, and crafted items across supported chains"
                    icon={FaFlask}
                />
            </SimpleGrid>

            <Center mt={8}>
                <Box
                    maxW="md"
                    p={6}
                    border="1px"
                    borderColor="gray.600"
                    rounded="xl"
                    bgColor="rgba(0,0,0,0.2)"
                    shadow="md"
                >
                    <VStack spacing={3}>
                        <Text fontSize="md" fontWeight="bold" color="white" textAlign="center">
                            How the Elyxir Bridge Works
                        </Text>
                        <Text fontSize="sm" textAlign="center" color="gray.300" lineHeight="1.6">
                            <strong>Step 1:</strong> Select GEM currency or Elyxir items<br/>
                            <strong>Step 2:</strong> Choose source and destination chain<br/>
                            <strong>Step 3:</strong> Follow the secure 3-step transfer process<br/>
                            <strong>Step 4:</strong> Confirm and complete your cross-chain swap
                        </Text>
                        <Text fontSize="xs" textAlign="center" color="gray.500" mt={2}>
                            🔒 All transfers are secured by blockchain technology
                        </Text>
                    </VStack>
                </Box>
            </Center>
        </Box>
    );
};

export default Bridge;
