import {
    Box,
    Button,
    Stack,
    Text,
    Image,
    Badge,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    HStack,
    useDisclosure,
} from '@chakra-ui/react';

/**
 * @name PotionSelector
 * @description Component for selecting and managing battle potions.
 * Displays the currently selected potion or a placeholder for selection.
 * Includes a modal for potion selection with detailed information.
 * @param {Object|null} selectedPotion - Currently selected potion object
 * @param {Function} setSelectedPotion - Function to set the selected potion
 * @param {boolean} isMobile - Flag indicating if the display is on a mobile device
 * @returns {JSX.Element} JSX layout for potion selection
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const PotionSelector = ({ selectedPotion, setSelectedPotion, isMobile }) => {
    const { isOpen: isPotionModalOpen, onOpen: onPotionModalOpen, onClose: onPotionModalClose } = useDisclosure();

    // Mock potions data for battlegrounds
    const mockPotions = [
        {
            id: 'pot1',
            name: 'Lava Elixir',
            image: '/images/items/Lava copia.png',
            medium: 'Terrestrial',
            type: 'Buff',
            description: '+1 Power to Terrestrial creatures',
            quantity: 3,
            bonus: { medium: 'Terrestrial', value: 1 }
        },
        {
            id: 'pot2',
            name: 'Wind Essence',
            image: '/images/items/Wind copia.png',
            medium: 'Aerial',
            type: 'Buff',
            description: '+1 Power to Aerial creatures',
            quantity: 2,
            bonus: { medium: 'Aerial', value: 1 }
        },
        {
            id: 'pot3',
            name: 'Aquatic Essence',
            image: '/images/items/Water sea.png',
            medium: 'Aquatic',
            type: 'Buff',
            description: '+1 Power to Aquatic creatures',
            quantity: 2,
            bonus: { medium: 'Aquatic', value: 1 }
        },
        {
            id: 'pot4',
            name: 'Blood of Asia',
            image: '/images/items/Blood copia.png',
            continent: 'Asia',
            type: 'Buff',
            description: '+1 Power to Asia creatures',
            quantity: 1,
            bonus: { continent: 'Asia', value: 1 }
        },
        {
            id: 'pot5',
            name: 'Sacred Water',
            image: '/images/items/Holi Water2 copia.png',
            type: 'Universal',
            description: '+1 Power to all creatures',
            quantity: 1,
            bonus: { universal: true, value: 1 }
        },
        {
            id: 'pot6',
            name: 'Crystal Water',
            image: '/images/items/WaterCristaline copia.png',
            medium: 'Aquatic',
            type: 'Pure',
            description: '+1 Power to Aquatic creatures',
            quantity: 4,
            bonus: { medium: 'Aquatic', value: 1 }
        },
    ];

    const handleSelectPotion = (potion) => {
        setSelectedPotion(potion);
        onPotionModalClose();
    };

    const getMediumColor = (medium) => {
        const colors = {
            'Terrestrial': 'red',
            'Aerial': 'cyan',
            'Aquatic': 'blue',
        };
        return colors[medium] || 'gray';
    };

    const getContinentColor = (continent) => {
        const colors = {
            'Asia': 'orange',
            'Europe': 'green', 
            'Africa': 'yellow',
            'America': 'purple',
            'Oceania': 'teal',
        };
        return colors[continent] || 'gray';
    };

    return (
        <>
            {/* Potion Selection Section - Enhanced Visibility */}
            <Box
                w={'80%'}
                mx={'auto'}
                mt={isMobile ? 4 : 6}
                p={4}
                borderRadius="md"
                border="2px solid #D597B2"
                background="rgba(208, 143, 176, 0.1)">
                <Stack direction={'row'} justifyContent={'space-between'} align={'center'}>
                    <Text
                        color={'#D597B2'}
                        textAlign={'center'}
                        my={'auto'}
                        fontFamily={'Chelsea Market, system-ui'}
                        fontSize={isMobile ? 'md' : 'large'}>
                        🧪 BATTLE POTION
                    </Text>
                    <Stack direction={'row'} spacing={3} align={'center'}>
                        {selectedPotion ? (
                            <>
                                <Box
                                    position="relative"
                                    cursor="pointer"
                                    onClick={onPotionModalOpen}
                                    _hover={{ transform: 'scale(1.05)' }}
                                    transition="transform 0.2s">
                                    <Image
                                        src={selectedPotion.image}
                                        fallbackSrc="/images/items/WaterCristaline copia.png"
                                        boxSize={isMobile ? '50px' : '60px'}
                                        borderRadius="md"
                                        border="3px solid #D597B2"
                                        shadow="0 0 10px rgba(213, 151, 178, 0.5)"
                                    />
                                    <Badge
                                        position="absolute"
                                        top="-8px"
                                        right="-8px"
                                        colorScheme={selectedPotion.medium ? getMediumColor(selectedPotion.medium) : selectedPotion.continent ? getContinentColor(selectedPotion.continent) : 'gray'}
                                        fontSize="xs">
                                        {selectedPotion.medium || selectedPotion.continent || selectedPotion.type}
                                    </Badge>
                                </Box>
                                <Stack flex={1} spacing={1}>
                                    <Text
                                        color={'#FFF'}
                                        fontFamily={'Chelsea Market, system-ui'}
                                        fontSize={isMobile ? 'sm' : 'md'}
                                        fontWeight={'bold'}>
                                        {selectedPotion.name}
                                    </Text>
                                    <Text
                                        color={'#D597B2'}
                                        fontSize={isMobile ? 'xs' : 'sm'}
                                        fontFamily={'Inter, system-ui'}>
                                        {selectedPotion.description}
                                    </Text>
                                </Stack>
                                <Stack spacing={2}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        colorScheme="purple"
                                        onClick={onPotionModalOpen}>
                                        Change
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        color="red.400"
                                        onClick={() => setSelectedPotion(null)}>
                                        Remove
                                    </Button>
                                </Stack>
                            </>
                        ) : (
                            <Stack direction={'row'} spacing={3} align={'center'}>
                                <Box
                                    w={isMobile ? '50px' : '60px'}
                                    h={isMobile ? '50px' : '60px'}
                                    borderRadius="md"
                                    border="3px dashed #D597B2"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    cursor="pointer"
                                    _hover={{ borderColor: '#F48794' }}
                                    onClick={onPotionModalOpen}>
                                    <Text
                                        color={'#D597B2'}
                                        fontSize={'2xl'}
                                        fontFamily={'Chelsea Market, system-ui'}>
                                        +
                                    </Text>
                                </Box>
                                <Stack spacing={1}>
                                    <Text
                                        color={'#FFF'}
                                        fontFamily={'Chelsea Market, system-ui'}
                                        fontSize={isMobile ? 'sm' : 'md'}>
                                        No Potion Selected
                                    </Text>
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        colorScheme="purple"
                                        onClick={onPotionModalOpen}
                                        _hover={{ transform: 'scale(1.05)' }}
                                        transition="transform 0.2s">
                                        Use Potion
                                    </Button>
                                </Stack>
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            </Box>

            {/* Potion Selection Modal */}
            <Modal isOpen={isPotionModalOpen} onClose={onPotionModalClose} isCentered size="xl">
                <ModalOverlay />
                <ModalContent bgColor={'#1F2323'} border={'2px solid #D597B2'} borderRadius="xl">
                    <ModalHeader mx={'auto'} color={'#D597B2'} fontFamily={'Chelsea Market, system-ui'}>
                        🧪 Choose Your Battle Potion
                    </ModalHeader>
                    <ModalCloseButton color={'#FFF'} />
                    <ModalBody>
                        <Text color={'#FFF'} textAlign={'center'} mb={4} fontSize={'sm'} fontFamily={'Inter, system-ui'}>
                            Select a potion to enhance your creatures in battle. Each potion provides unique bonuses.
                        </Text>
                        <SimpleGrid columns={isMobile ? 1 : 2} spacing={4}>
                            {mockPotions.map((potion) => (
                                <Box
                                    key={potion.id}
                                    bg={selectedPotion?.id === potion.id ? 'rgba(213, 151, 178, 0.15)' : '#465A5A'}
                                    borderRadius={'10px'}
                                    p={4}
                                    cursor={'pointer'}
                                    border={selectedPotion?.id === potion.id ? '3px solid #D597B2' : '2px solid transparent'}
                                    onClick={() => handleSelectPotion(potion)}
                                    transition="all 0.2s"
                                    _hover={{ 
                                        bg: selectedPotion?.id === potion.id ? 'rgba(213, 151, 178, 0.25)' : '#5A679B',
                                        transform: 'scale(1.02)'
                                    }}>
                                    <HStack spacing={3}>
                                        <Box position="relative">
                                            <Image
                                                src={potion.image}
                                                fallbackSrc="/images/items/WaterCristaline copia.png"
                                                boxSize="70px"
                                                borderRadius="md"
                                                border="2px solid #D597B2"
                                            />
                                            <Badge
                                                position="absolute"
                                                top="-8px"
                                                right="-8px"
                                                colorScheme={potion.medium ? getMediumColor(potion.medium) : potion.continent ? getContinentColor(potion.continent) : 'gray'}
                                                fontSize="xs">
                                                {potion.medium || potion.continent || potion.type}
                                            </Badge>
                                        </Box>
                                        <Stack flex={1} spacing={1}>
                                            <Text
                                                color={'#FFF'}
                                                fontWeight={'bold'}
                                                fontSize={'md'}
                                                fontFamily={'Chelsea Market, system-ui'}>
                                                {potion.name}
                                            </Text>
                                            <HStack spacing={2}>
                                                {potion.medium && (
                                                    <Badge colorScheme={getMediumColor(potion.medium)} size="sm">
                                                        {potion.medium}
                                                    </Badge>
                                                )}
                                                {potion.continent && (
                                                    <Badge colorScheme={getContinentColor(potion.continent)} size="sm">
                                                        {potion.continent}
                                                    </Badge>
                                                )}
                                                <Badge colorScheme="gray" size="sm">
                                                    {potion.type}
                                                </Badge>
                                            </HStack>
                                            <Text color={'#D597B2'} fontSize={'sm'} fontFamily={'Inter, system-ui'}>
                                                {potion.description}
                                            </Text>
                                            <Text color={'#FFF'} fontSize={'xs'} fontFamily={'Inter, system-ui'}>
                                                Available: {potion.quantity}
                                            </Text>
                                        </Stack>
                                        {selectedPotion?.id === potion.id && (
                                            <Box color={'#D597B2'} fontSize={'xl'}>
                                                ✓
                                            </Box>
                                        )}
                                    </HStack>
                                </Box>
                            ))}
                        </SimpleGrid>
                        {mockPotions.length === 0 && (
                            <Box textAlign="center" py={8}>
                                <Text color={'#FFF'} fontFamily={'Inter, system-ui'}>
                                    No potions available. Earn potions from bounty rewards or pack openings!
                                </Text>
                            </Box>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="ghost"
                            color={'#FFF'}
                            onClick={onPotionModalClose}
                            mr={3}>
                            Cancel
                        </Button>
                        {selectedPotion && (
                            <Button
                                colorScheme="red"
                                variant="outline"
                                onClick={() => {
                                    setSelectedPotion(null);
                                    onPotionModalClose();
                                }}
                                mr={3}>
                                Clear Selection
                            </Button>
                        )}
                        <Button
                            colorScheme="purple"
                            onClick={onPotionModalClose}>
                            Confirm Selection
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default PotionSelector;
