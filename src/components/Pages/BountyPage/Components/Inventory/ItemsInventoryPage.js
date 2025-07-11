import {
    Box,
    Center,
    Flex,
    Heading,
    Img,
    Select,
    SimpleGrid,
    Spacer,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import BountyItems from './BountyItems';

const ItemsInventoryPage = ({ infoAccount, items, isMobile, gridColumns, handleCloseInventory }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [filters, setFilters] = useState({
        rarity: '',
        type: '',
    });

    // Mock items data
    const mockItems = [
        {
            id: 1,
            name: 'Terrestrial Elixir',
            image: '/images/currency/gem.png',
            type: 'medium',
            bonus: 1,
            quantity: 3,
            description: 'A mystical potion that enhances the power of terrestrial creatures.',
            rarity: 'Common',
            element: 'Terrestrial'
        },
        {
            id: 2,
            name: 'Asian Spirit Brew',
            image: '/images/currency/mana.png',
            type: 'continent',
            bonus: 1,
            quantity: 2,
            description: 'An ancient brew that strengthens creatures from the Asian continent.',
            rarity: 'Rare',
            continent: 'Asia'
        },
        {
            id: 3,
            name: 'Power Surge Potion',
            image: '/images/currency/ignis.png',
            type: 'power',
            bonus: 2,
            quantity: 1,
            description: 'A rare potion that provides raw power boost to any creature.',
            rarity: 'Epic'
        }
    ];

    const handleEdit = (itemId, quantity) => {
        const newSelectedItems = selectedItems.map(selectedItem => {
            if (selectedItem.id === itemId) {
                return { ...selectedItem, selectQuantity: Number(quantity) };
            }
            return selectedItem;
        });
        setSelectedItems([...newSelectedItems]);
    };

    const handleDeleteSelectedItem = itemId => {
        const newSelectedItems = selectedItems.filter(selectedItem => selectedItem.id !== itemId);
        setSelectedItems(newSelectedItems);
    };

    const myItems = items.length > 0 ? items : mockItems.filter(item => item.quantity > 0);
    const notSelectedItems = myItems.filter(item => !selectedItems.some(selected => selected.id === item.id));

    const handleRarityChange = event => {
        setFilters(prevFilters => ({
            ...prevFilters,
            rarity: event.target.value,
        }));
    };

    const handleTypeChange = event => {
        setFilters(prevFilters => ({
            ...prevFilters,
            type: event.target.value,
        }));
    };

    const filteredNotSelectedItems = notSelectedItems
        .filter(item => {
            const rarityMapping = {
                1: 'Common',
                2: 'Rare',
                3: 'Epic',
                4: 'Special',
            };
            return filters.rarity && filters.rarity !== '-1' ? item.rarity === rarityMapping[filters.rarity] : true;
        })
        .filter(item => {
            return filters.type && filters.type !== '-1' ? item.type === filters.type : true;
        });

    const optionStyle = { backgroundColor: '#FFF', color: '#000' };
    const textColor = useColorModeValue('black', 'white');

    return (
        <>
            <Stack
                direction={'column'}
                color={'#FFF'}
                mb={isMobile ? 3 : 5}
                mt={isMobile && 2}
                mx={'auto'}
                textAlign={'center'}
                maxH={'90%'}>
                <Heading fontFamily={'Chelsea Market, System'} fontWeight={100} size={isMobile ? 'md' : 'xl'}>
                    POTIONS INVENTORY
                </Heading>
                <Text fontSize={isMobile ? 'sm' : 'xl'}>
                    Here you can select potions to burn for bounty rewards
                </Text>
            </Stack>
            <Stack backgroundColor={'#0F0F0F'} borderRadius={'20px'} h={isMobile ? '80%' : '85%'}>
                <Heading fontSize="xl" fontWeight="light" textAlign="center" mt={3}>
                    1. Select potions to burn for bounty
                </Heading>
                <Stack direction="row" fontFamily={'Chelsea Market, system-ui'} ml={'10'}>
                    <Select
                        w={isMobile ? '25%' : '10%'}
                        bg={'#FFF'}
                        color={'#000'}
                        fontWeight={100}
                        value={filters.rarity}
                        onChange={handleRarityChange}>
                        <option value="-1" style={optionStyle}>
                            All Rarities
                        </option>
                        <option value="1" style={optionStyle}>
                            Common
                        </option>
                        <option value="2" style={optionStyle}>
                            Rare
                        </option>
                        <option value="3" style={optionStyle}>
                            Epic
                        </option>
                        <option value="4" style={optionStyle}>
                            Special
                        </option>
                    </Select>
                    <Select
                        w={isMobile ? '25%' : '10%'}
                        bg={'#FFF'}
                        color={'#000'}
                        fontWeight={100}
                        value={filters.type}
                        onChange={handleTypeChange}>
                        <option value="-1" style={optionStyle}>
                            All Types
                        </option>
                        <option value="medium" style={optionStyle}>
                            Medium
                        </option>
                        <option value="continent" style={optionStyle}>
                            Continent
                        </option>
                        <option value="power" style={optionStyle}>
                            Power
                        </option>
                    </Select>
                </Stack>
                <Stack direction="row" padding={5} pt={0} height={isMobile ? '80%' : '90%'}>
                    <Box
                        mb={2}
                        borderRadius={'20px'}
                        p={4}
                        pt={0}
                        w={'90%'}
                        mx={'auto'}
                        h={'100%'}
                        overflowY={'auto'}
                        className="custom-scrollbar">
                        <SimpleGrid
                            columns={gridColumns()}
                            spacing={3}
                            p={3}
                            h={'100%'}
                            overflowY={'auto'}
                            className="custom-scrollbar">
                            {filteredNotSelectedItems.length > 0 ? (
                                filteredNotSelectedItems.map((item, i) => {
                                    const { name, image, rarity, type, quantity } = item;
                                    return (
                                        <Box
                                            key={i}
                                            bg={'white'}
                                            borderRadius={'10px'}
                                            mx={'auto'}
                                            maxH={'345px'}
                                            cursor="pointer"
                                            onClick={() => setSelectedItems([...selectedItems, item])}>
                                            <Center>
                                                <Img src={image} w={'90%'} h={'75%'} />
                                            </Center>
                                            <Stack direction={'column'} spacing={0} mx={2} mb={1}>
                                                <Stack
                                                    direction="column"
                                                    spacing={0}
                                                    align={{ base: 'center', lg: 'start' }}>
                                                    <Text
                                                        fontSize={{ base: 'sm', md: 'md', '2xl': 'xl' }}
                                                        noOfLines={1}
                                                        fontWeight="bold"
                                                        color={'#000'}>
                                                        {name}
                                                    </Text>
                                                    <Stack direction="row" spacing={1}>
                                                        <Text
                                                            px={1}
                                                            fontSize="xs"
                                                            bgColor="gray.600"
                                                            rounded="md"
                                                            color="white">
                                                            {rarity}
                                                        </Text>
                                                        <Text
                                                            px={1}
                                                            fontSize="xs"
                                                            bgColor="blue.600"
                                                            rounded="md"
                                                            color="white">
                                                            {type}
                                                        </Text>
                                                    </Stack>
                                                </Stack>
                                                <Spacer display={{ base: 'none', lg: 'block' }} />
                                                <Center minHeight={{ base: 'auto', lg: '100%' }}>
                                                    <Tooltip display={'flex'} placement="bottom">
                                                        <Flex w={{ base: 'auto', lg: '100%' }}>
                                                            <Text
                                                                textAlign="end"
                                                                minH={{ base: '100%', lg: 'auto' }}
                                                                fontSize={'small'}
                                                                color={'#000'}>
                                                                Quantity: {quantity}
                                                            </Text>
                                                        </Flex>
                                                    </Tooltip>
                                                </Center>
                                            </Stack>
                                        </Box>
                                    );
                                })
                            ) : (
                                <Text
                                    position={'absolute'}
                                    fontFamily={'Chelsea Market, system-ui'}
                                    color={'#FFF'}
                                    fontSize={'xl'}
                                    top={'50%'}
                                    left={'50%'}
                                    transform={'translate(-50%, -50%)'}>
                                    No potions available
                                </Text>
                            )}
                        </SimpleGrid>
                        {filteredNotSelectedItems.length <= 0 && (
                            <Box
                                top={'50%'}
                                transform={'translateY(-50%)'}
                                pos={'absolute'}
                                m={'auto'}
                                boxSize="fit-content">
                                <Text color={textColor}>You don't have more potions</Text>
                            </Box>
                        )}
                    </Box>
                    <Box
                        mb={4}
                        maxW={isMobile ? '100%' : '60%'}
                        minH={'50%'}
                        backgroundColor={'#0F0F0F'}
                        borderRadius={'20px'}
                        p={4}
                        className="custom-scrollbar"
                        overflowX={'scroll'}>
                        <BountyItems
                            infoAccount={infoAccount}
                            isMobile={isMobile}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                            handleEdit={handleEdit}
                            handleDeleteSelectedItem={handleDeleteSelectedItem}
                            handleCloseInventory={handleCloseInventory}
                        />
                    </Box>
                </Stack>
            </Stack>
        </>
    );
};

export default ItemsInventoryPage;
