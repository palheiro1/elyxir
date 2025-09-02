import { useState } from 'react';

import {
    Box,
    Button,
    Center,
    Flex,
    Image,
    SimpleGrid,
    Spacer,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
} from '@chakra-ui/react';
import { getTypeValue, getColor } from './data';

/**
 * @name ItemCard
 * @description ItemCard component - Shows the potion/item data and actions
 * @param {Object} item - Object with the item data
 * @param {Function} setItemClicked - Function to set the item clicked
 * @param {Function} onOpen - Function to open the dialog
 * @param {Boolean} isMarket - Boolean to know if the item is in the market
 * @param {Boolean} onlyBuy - Boolean to know if the item is only buyable
 * @param {String} username - String with the username
 * @param {Object} infoAccount - Object with the account info
 * @param {String} market - String with the market
 * @param {String} rgbColor - String with the RGB color
 * @returns {JSX.Element} - JSX element
 */
const ItemCard = ({
    item,
    setItemClicked,
    onOpen,
    isMarket = false,
    onlyBuy = true,
    username,
    infoAccount = {},
    market = 'IGNIS',
    rgbColor = '59, 100, 151',
}) => {
    // const newBgColor = `rgba(${rgbColor}, 0.1)`;
    // const newBorderColor = 'rgba(47, 129, 144, 1)';
    const separatorColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    const { name, imgUrl, bonus, quantityQNT = 0, description } = item;

    const handleClick = ({ item }) => {
        setItemClicked(item);
        onOpen();
    };

    const bgColor = `rgba(${rgbColor}, 0.1)`;
    const [hover, setHover] = useState(false);
    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    const initialStyle = {
        transform: 'scale(1)',
        transition: 'all 0.3s ease-in-out',
        shadow: 'none',
    };
    const hoverStyle = {
        cursor: 'pointer',
        transform: 'scale(1.025)',
        transition: 'all 0.3s ease-in-out',
        shadow: 'xl',
    };

    const haveThisItem = quantityQNT > 0;
    const itemOpacity = haveThisItem ? 1 : 0.25;

    // const [canUseIcon] = useMediaQuery('(min-width: 1200px)');

    // const ItemButton = ({ text, onClick, isDisabled = false, icon }) => (
    //     <Button
    //         fontWeight="medium"
    //         border="2px"
    //         borderColor={newBorderColor}
    //         bgColor={newBgColor}
    //         color="white"
    //         fontSize={{ base: 'xs', md: 'sm' }}
    //         leftIcon={canUseIcon ? icon : null}
    //         _hover={{ fontWeight: 'bold', shadow: 'xl', bgColor: newBorderColor }}
    //         onClick={onClick}
    //         isDisabled={isDisabled}>
    //         {text}
    //     </Button>
    // );

    return (
        <Box
            p={3}
            rounded="lg"
            bgColor={bgColor}
            borderColor={borderColor}
            minH={{ base: '25rem', md: '29rem' }}
            minW={{ base: '15rem', md: '12rem' }}>
            <Center>
                <SimpleGrid columns={1} spacing={{ base: 2, lg: 4 }}>
                    <Image
                        minH="20rem"
                        src={imgUrl}
                        alt={name}
                        rounded="lg"
                        onClick={() => (haveThisItem ? handleClick({ item: item }) : null)}
                        style={hover ? hoverStyle : initialStyle}
                        onMouseEnter={() => (haveThisItem ? setHover(true) : null)}
                        onMouseLeave={() => (haveThisItem ? setHover(false) : null)}
                        opacity={itemOpacity}
                    />

                    <Stack direction={{ base: 'column', lg: 'row' }} spacing={0}>
                        <Stack direction="column" spacing={0} align={{ base: 'center', lg: 'start' }}>
                            <Text fontSize={{ base: 'sm', md: 'md', '2xl': 'xl' }} noOfLines={1} fontWeight="bold">
                                {description}
                            </Text>
                            <Stack direction="row" spacing={1}>
                                <Text
                                    px={2}
                                    fontSize="sm"
                                    bgColor={getColor(bonus)}
                                    rounded="lg"
                                    color="white"
                                    textTransform={'capitalize'}>
                                    {bonus.type} ({getTypeValue(bonus)})
                                </Text>
                            </Stack>
                            <Text fontSize="xs" color="gray.400" noOfLines={2}>
                                {description}
                            </Text>
                            <Text fontSize="sm" color="green.400">
                                +{bonus.power} Power
                            </Text>
                        </Stack>
                        <Spacer display={{ base: 'none', lg: 'block' }} />
                        <Center minHeight={{ base: 'auto', lg: '100%' }}>
                            <Tooltip placement="bottom">
                                <Flex w={{ base: 'auto', lg: '100%' }}>
                                    <Text textAlign="end" minH={{ base: '100%', lg: 'auto' }}>
                                        <small>Quantity:</small> {quantityQNT}
                                    </Text>
                                </Flex>
                            </Tooltip>
                        </Center>
                    </Stack>

                    {/* {!isMarket && (
                        <Box>
                            <SimpleGrid columns={1} gap={1}>
                                <ItemButton
                                    text="Use in Battle"
                                    onClick={() => {}}
                                    isDisabled={!haveThisItem}
                                    icon={<Image src="/images/battlegrounds/attack_icon.svg" w="15px" />}
                                />
                            </SimpleGrid>
                        </Box>
                    )} */}

                    {isMarket && (
                        <Center>
                            <Stack direction="column" w="100%">
                                <Stack direction="row" w="100%">
                                    <Button
                                        onClick={() => {}}
                                        size="lg"
                                        bgColor="#29a992"
                                        w="100%"
                                        color="white"
                                        fontWeight={'black'}
                                        _hover={{ shadow: 'lg' }}>
                                        BUY
                                    </Button>
                                    <Button
                                        onClick={() => {}}
                                        size="lg"
                                        w="100%"
                                        color="white"
                                        bgColor="#eb6473"
                                        isDisabled={!haveThisItem}
                                        fontWeight={'black'}
                                        _hover={{ shadow: 'lg' }}>
                                        SELL
                                    </Button>
                                </Stack>
                                <Box borderTop="1px" borderTopColor={separatorColor} pt={4}>
                                    <SimpleGrid columns={3} spacing={4}>
                                        <Box>
                                            <Text fontSize="sm" color="gray" textAlign="center">
                                                Lowest ask
                                            </Text>
                                            <Text fontWeight="bold" fontSize="lg" textAlign="center">
                                                N/A
                                            </Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" color="gray" textAlign="center">
                                                Highest bid
                                            </Text>
                                            <Text fontWeight="bold" fontSize="lg" textAlign="center">
                                                N/A
                                            </Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" color="gray" textAlign="center">
                                                Latest price
                                            </Text>
                                            <Text fontWeight="bold" fontSize="lg" textAlign="center">
                                                N/A
                                            </Text>
                                        </Box>
                                    </SimpleGrid>
                                </Box>
                            </Stack>
                        </Center>
                    )}
                </SimpleGrid>
            </Center>
        </Box>
    );
};

export default ItemCard;
