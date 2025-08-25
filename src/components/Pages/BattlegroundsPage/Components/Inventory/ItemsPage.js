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
import OmnoItems from './OmnoItems';

const ItemsPage = ({ infoAccount, items, isMobile, gridColumns }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [filters, setFilters] = useState({
        rarity: '',
        type: '',
    });

    const handleEdit = (item, quantity) => {
        const newSelectedItems = selectedItems.map(selectedItem => {
            if (selectedItem.id === item.id) {
                return { ...selectedItem, selectQuantity: Number(quantity) };
            }
            return selectedItem;
        });
        setSelectedItems([...newSelectedItems]);
    };

    const handleDeleteSelectedItem = item => {
        const newSelectedItems = selectedItems.filter(selectedItem => selectedItem.id !== item.id);
        setSelectedItems(newSelectedItems);
    };

    const myItems = items.filter(item => parseInt(item.quantity) > 0);
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
            return filters.rarity && filters.rarity !== '-1' ? item.rarity === filters.rarity : true;
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
                    POTIONS
                </Heading>
                <Text fontSize={isMobile ? 'sm' : 'xl'}>
                    Send your potions to battlegrounds to use them in combat
                </Text>
            </Stack>
            <Stack backgroundColor={'#0F0F0F'} borderRadius={'20px'} h={isMobile ? '80%' : '85%'}>
                <Heading fontSize={isMobile ? 'md' : 'xl'} fontWeight="light" textAlign="center" mt={3}>
                    1. Select potions to send to Battlegrounds
                </Heading>
                <Stack direction="row" fontFamily={'Chelsea Market, system-ui'} ml={!isMobile && '10'}>
                    <Select w={isMobile ? '20%' : '10%'} onChange={handleRarityChange} color={'#FFF'}>
                        <option value="-1" style={optionStyle}>
                            Rarity
                        </option>
                        <option value="Common" style={optionStyle}>
                            Common
                        </option>
                        <option value="Rare" style={optionStyle}>
                            Rare
                        </option>
                        <option value="Epic" style={optionStyle}>
                            Epic
                        </option>
                        <option value="Legendary" style={optionStyle}>
                            Legendary
                        </option>
                    </Select>

                    <Select w={isMobile ? '20%' : '10%'} onChange={handleTypeChange} color={'#FFF'}>
                        <option value="-1" style={optionStyle}>
                            Type
                        </option>
                        <option value="Healing" style={optionStyle}>
                            Healing
                        </option>
                        <option value="Buff" style={optionStyle}>
                            Buff
                        </option>
                        <option value="Debuff" style={optionStyle}>
                            Debuff
                        </option>
                        <option value="Utility" style={optionStyle}>
                            Utility
                        </option>
                    </Select>
                </Stack>
                <Stack direction={'row'} pt={2} padding={5} height={'inherit'}>
                    <Box
                        mb={4}
                        p={2}
                        mt={-2}
                        w={isMobile ? '45%' : '65%'}
                        overflowY={'scroll'}
                        className="custom-scrollbar"
                        mx="auto"
                        display="flex"
                        justifyContent="center">
                        <SimpleGrid
                            columns={gridColumns()}
                            gap={4}
                            align={'center'}
                            overflowY={'auto'}
                            className="custom-scrollbar"
                            w={'100%'}
                            p={4}
                            overflow={'scroll'}
                            height={'100%'}>
                            {filteredNotSelectedItems.length > 0 &&
                                filteredNotSelectedItems.map((item, itemIndex) => {
                                    const { name, image, rarity, type, quantity, description } = item;
                                    return (
                                        <Box
                                            key={itemIndex}
                                            bg={'white'}
                                            borderRadius={'10px'}
                                            mx={'auto'}
                                            maxH={'345px'}
                                            cursor="pointer"
                                            onClick={() => setSelectedItems([...selectedItems, item])}>
                                            <Center>
                                                <Img src={image} w={'90%'} h={'75%'} fallbackSrc="/images/items/WaterCristaline copia.png" />
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
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.600"
                                                        noOfLines={1}>
                                                        {type} • {rarity}
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.500"
                                                        noOfLines={2}>
                                                        {description}
                                                    </Text>
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
                                                                Available quantity: {quantity}
                                                            </Text>
                                                        </Flex>
                                                    </Tooltip>
                                                </Center>
                                            </Stack>
                                        </Box>
                                    );
                                })}
                        </SimpleGrid>
                        {filteredNotSelectedItems.length <= 0 && (
                            <Box
                                top={'50%'}
                                transform={'translateY(-50%)'}
                                pos={'absolute'}
                                m={'auto'}
                                boxSize="fit-content">
                                <Text color={textColor}>You don't have any potions available</Text>
                            </Box>
                        )}
                    </Box>
                    <Box
                        mb={4}
                        maxW={isMobile ? '80%' : '60%'}
                        backgroundColor={'#0F0F0F'}
                        borderRadius={'20px'}
                        p={4}
                        className="custom-scrollbar"
                        overflowX={'scroll'}>
                        <OmnoItems
                            infoAccount={infoAccount}
                            isMobile={isMobile}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                            handleEdit={handleEdit}
                            handleDeleteSelectedItem={handleDeleteSelectedItem}
                        />
                    </Box>
                </Stack>
            </Stack>
        </>
    );
};

export default ItemsPage;
