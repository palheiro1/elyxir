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
import { getColor, getTypeValue } from '../../../../../Items/data';

/**
 * @name ItemsPage
 * @description Component that displays the list of available potions and allows the user to select, filter, and manage them
 * for sending to or withdrawing from Battlegrounds. It provides UI controls for filtering by type, selecting potions, and
 * managing selected items with edit and delete operations.
 * @param {Object} props - Component props.
 * @param {Object} props.infoAccount - Information about the user's account, passed down to `OmnoItems`.
 * @param {Array} props.items - List of available potion items from Redux store.
 * @param {boolean} props.isMobile - Indicates if the view is mobile for responsive adjustments.
 * @param {number} props.gridColumns - Number of grid columns for potion display.
 * @param {boolean} props.withdraw - Defines if the mode is withdraw (inventory) or send to Battlegrounds.
 * @param {Array} props.selectedItems - Array of currently selected items.
 * @param {Function} props.setSelectedItems - State setter for selected items.
 * @returns {JSX.Element} Rendered `ItemsPage` component.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const ItemsPage = ({ infoAccount, items, isMobile, gridColumns, withdraw, selectedItems, setSelectedItems }) => {
    const [filters, setFilters] = useState({
        rarity: '',
        type: '',
    });

    const quantityKey = withdraw ? 'omnoQuantity' : 'quantityQNT';

    const handleEdit = (item, quantity) => {
        const newSelectedItems = selectedItems.map(selectedItem => {
            if (selectedItem.asset === item.asset) {
                return { ...selectedItem, selectQuantity: Number(quantity) };
            }
            return selectedItem;
        });
        setSelectedItems([...newSelectedItems]);
    };

    const handleDeleteSelectedItem = item => {
        const newSelectedItems = selectedItems.filter(selectedItem => selectedItem.asset !== item.asset);
        setSelectedItems(newSelectedItems);
    };

    const myItems = items.filter(item => parseInt(item[quantityKey]) > 0);
    const notSelectedItems = myItems.filter(item => !selectedItems.some(selected => selected.asset === item.asset));

    const handleTypeChange = event => {
        setFilters(prevFilters => ({
            ...prevFilters,
            type: event.target.value,
        }));
    };

    const filteredNotSelectedItems = notSelectedItems.filter(item => {
        return filters.type && filters.type !== '-1' ? item.bonus.type === filters.type : true;
    });

    const optionStyle = { backgroundColor: '#FFF', color: '#000' };
    const textColor = useColorModeValue('black', 'white');

    const subTitle = withdraw
        ? 'Withdraw your potions from battlegrounds to your inventory'
        : 'Send your potions to battlegrounds to use them in combat';

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
                <Text fontSize={isMobile ? 'sm' : 'xl'}>{subTitle}</Text>
            </Stack>
            <Stack backgroundColor={'#0F0F0F'} borderRadius={'20px'} h={isMobile ? '80%' : '85%'}>
                <Heading fontSize={isMobile ? 'md' : 'xl'} fontWeight="light" textAlign="center" mt={3}>
                    1. Select potions to {withdraw ? 'withdraw from' : 'send to'} Battlegrounds
                </Heading>
                <Stack direction="row" fontFamily={'Chelsea Market, system-ui'} ml={!isMobile && '10'}>
                    <Select w={isMobile ? '20%' : '10%'} onChange={handleTypeChange} color={'#FFF'}>
                        <option value="-1" style={optionStyle}>
                            Type
                        </option>
                        <option value="medium" style={optionStyle}>
                            Medium
                        </option>
                        <option value="domain" style={optionStyle}>
                            Domain
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
                            columns={gridColumns}
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
                                    const { imgUrl, bonus, description } = item;
                                    return (
                                        <Box
                                            key={itemIndex}
                                            bg={'white'}
                                            borderRadius={'10px'}
                                            mx={'auto'}
                                            maxH={'296px'}
                                            _hover={{ transform: 'scale(1.025)' }}
                                            transition="transform 0.2s"
                                            cursor="pointer"
                                            onClick={() => setSelectedItems([...selectedItems, item])}>
                                            <Center>
                                                <Img
                                                    src={imgUrl}
                                                    w={'90%'}
                                                    h={'75%'}
                                                    fallbackSrc="/images/items/WaterCristaline copia.png"
                                                />
                                            </Center>
                                            <Stack direction={'column'} spacing={0} mx={2} mb={1}>
                                                <Stack
                                                    direction="column"
                                                    spacing={0}
                                                    align={{ base: 'center', lg: 'start' }}>
                                                    <Text
                                                        fontSize={{ base: 'sm', md: 'md', '2xl': 'xl' }}
                                                        fontWeight="bold"
                                                        h={'60px'}
                                                        textAlign={'start'}
                                                        color={'#000'}>
                                                        {description}
                                                    </Text>
                                                    <Text
                                                        px={2}
                                                        fontSize="sm"
                                                        bgColor={getColor(bonus)}
                                                        rounded="lg"
                                                        color={'white'}
                                                        textTransform={'capitalize'}>
                                                        {bonus.type} ({getTypeValue(bonus)})
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
                                                                Available quantity: {item[quantityKey]}
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
                            withdraw={withdraw}
                        />
                    </Box>
                </Stack>
            </Stack>
        </>
    );
};

export default ItemsPage;
