import {
    Box,
    Center,
    Grid,
    GridItem,
    HStack,
    IconButton,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { GiCutDiamond } from 'react-icons/gi';
import { NQTDIVIDER } from '../../../data/CONSTANTS';
import TradeDialog from '../../Modals/TradeDialog/TradeDialog';

/**
 * @name GemWidget
 * @description Widget that shows the amount of GEMs the user has
 * @param {String} username - String with the username
 * @param {Object} gemCards - Object with the gemCards data
 * @param {Number} IGNISBalance - Object with the IGNIS balance data
 * @returns {JSX.Element} - JSX Element with the widget
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const GemWidget = ({ username, gemCards = [], IGNISBalance }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const tradeRef = useRef();

    // ------------------------------

    const [hover, setHover] = useState(false);
    const initialStyle = {
        cursor: 'none',
        transform: 'scale(1)',
        transition: 'all 1.3s ease-in-out',
        shadow: 'none',
    };
    const hoverStyle = {
        cursor: 'pointer',
        transform: 'scale(1.35)',
        transition: 'all 0.6s ease-in-out',
        shadow: 'lg',
    };

    const textColor = useColorModeValue('black', 'white');
    const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

    // ------------------------------
    if (gemCards.length === 0) return null;
    const lowestGemAsk = gemCards.askOrders.length > 0 ? gemCards.askOrders[0].priceNQTPerShare / NQTDIVIDER : 0;
    const highestGemBid = gemCards.bidOrders.length > 0 ? gemCards.bidOrders[0].priceNQTPerShare / NQTDIVIDER : 0;

    let confirmedBalance = Number(gemCards.quantityQNT / NQTDIVIDER);
    confirmedBalance = Number.isInteger(confirmedBalance) ? confirmedBalance.toFixed(0) : confirmedBalance.toFixed(2);

    let unconfirmedBalance = Number(gemCards.unconfirmedQuantityQNT / NQTDIVIDER);
    unconfirmedBalance = Number.isInteger(unconfirmedBalance)
        ? unconfirmedBalance.toFixed(0)
        : unconfirmedBalance.toFixed(2);

    return (
        <>
            <Center mt={4} w="100%">
                <Grid
                    templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }}
                    border="1px"
                    borderColor="whiteAlpha.300"
                    rounded="lg"
                    bg="blackAlpha"
                    shadow="lg"
                    w={{ base: '100%', xl: 'unset' }}
                    direction="row">
                    <GridItem colSpan={2} p={4} borderLeftRadius="lg">
                        <Center>
                            <Stack direction={{ base: 'column', xl: 'row' }} spacing={4} align="center">
                                <IconButton
                                    icon={<GiCutDiamond />}
                                    size="xl"
                                    p={4}
                                    mr={2}
                                    fontSize="4xl"
                                    bg={bgColor}
                                    color={textColor}
                                />
                                <VStack align="flex-start">
                                    <Text color={textColor} fontSize="3xl" fontWeight="bold" mb={-3}>
                                        {confirmedBalance} GEMs
                                    </Text>
                                    <Text color={textColor} fontSize="md" textAlign={{ base: 'center', xl: 'left' }}>
                                        ({unconfirmedBalance} unconfirmed)
                                    </Text>
                                </VStack>
                                <Center pl={4}>
                                    <HStack spacing={4} color={textColor}>
                                        <Box p={2} bg={bgColor} rounded="lg" minW="90px">
                                            <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                                {lowestGemAsk}
                                            </Text>
                                            <Text textAlign="center" fontSize="xs">
                                                LOWEST ASK
                                            </Text>
                                        </Box>

                                        <Box p={2} bg={bgColor} rounded="lg" minW="90px">
                                            <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                                {highestGemBid}
                                            </Text>
                                            <Text textAlign="center" fontSize="xs">
                                                HIGHEST BID
                                            </Text>
                                        </Box>
                                    </HStack>
                                </Center>
                            </Stack>
                        </Center>
                    </GridItem>

                    <GridItem bgColor={bgColor} p={4} borderRightRadius="lg">
                        <Center
                            h="100%"
                            fontSize={{ base: '2xl', xl: 'xl' }}
                            fontWeight="bolder"
                            textTransform="full-width"
                            onClick={onOpen}
                            textAlign="center"
                            style={hover ? hoverStyle : initialStyle}
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}>
                            TRADE <br/>NOW
                        </Center>
                    </GridItem>
                </Grid>
            </Center>
            <TradeDialog
                isOpen={isOpen}
                onClose={onClose}
                reference={tradeRef}
                username={username}
                gemCards={gemCards}
                ignis={IGNISBalance}
            />
        </>
    );
};

export default GemWidget;
