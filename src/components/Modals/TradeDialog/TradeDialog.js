import { useRef } from 'react';

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Center,
    Image,
    SimpleGrid,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';

import AskDialog from './AskDialog/AskDialog';
import BidDialog from './BidDialog/BidDialog';
import { errorToast } from '../../../utils/alerts';
import { NQTDIVIDER } from '../../../data/CONSTANTS';
import AskAndBidGrid from '../../Pages/MarketPage/TradesAndOrders/AskAndBids/AskAndBidGrid';

/**
 * @name TradeDialog
 * @description Dialog to trade a card
 * @param {Object} reference - Reference to the button that opens the dialog
 * @param {Boolean} isOpen - Boolean to know if the dialog is open
 * @param {Function} onClose - Function to close the dialog
 * @param {Object} card - Object with the card data
 * @param {String} username - String with the username
 * @param {Object} ignis - Object with the ignis data
 * @param {Object} gemCards - Gem cards data - Optional
 * @param {Object} onlyBid - Boolean to know if the dialog only has the bid option - Optional
 */
const TradeDialog = ({
    reference,
    isOpen,
    onClose,
    card,
    username,
    ignis,
    gemCards = false,
    onlyBid = false,
    isBlocked = false,
    lockedCards = false,
}) => {
    const toast = useToast();

    const { isOpen: isOpenAsk, onOpen: onOpenAsk, onClose: onCloseAsk } = useDisclosure();
    const refAsk = useRef();

    const { isOpen: isOpenBid, onOpen: onOpenBid, onClose: onCloseBid } = useDisclosure();
    const refBid = useRef();

    const handleAsk = () => {
        if (isBlocked) {
            errorToast(`${lockedCards} card(s) locked for all actions. Check for open Ask orders to unlock.`, toast);
            return;
        }
        if (!gemCards && card.quantityQNT === 0) {
            errorToast("You can't ask for a card you don't have", toast);
            return;
        }
        onClose();
        onOpenAsk();
    };

    const handleBid = () => {
        onClose();
        onOpenBid();
    };

    const bgColor = useColorModeValue('', '#1D1D1D');
    const bgMarkedColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                size={'2xl'}
                onClose={onClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent bgColor={bgColor} border="1px" borderColor="whiteAlpha.400" shadow="dark-lg">
                    <AlertDialogHeader textAlign="center">
                        <Center>
                            <Text>TRADE CARD</Text>
                        </Center>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        {!gemCards ? (
                            <Center rounded="lg" bgColor={bgMarkedColor} p={4}>
                                <Stack direction="row" align="center" spacing={4}>
                                    <Image src={card.cardImgUrl} maxH="10rem" />
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">
                                            {card.name}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            {card.channel} / {card.rarity}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            Quantity: {card.quantityQNT}
                                        </Text>
                                    </Box>
                                </Stack>
                            </Center>
                        ) : (
                            <Center rounded="lg" bgColor="whiteAlpha.100" p={4}>
                                <Stack direction="row" align="center" spacing={4}>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                                            GEM
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            Quantity: {Number(gemCards.quantityQNT / NQTDIVIDER).toFixed(2)}
                                        </Text>
                                    </Box>
                                </Stack>
                            </Center>
                        )}
                        <SimpleGrid columns={onlyBid ? 1 : 2} my={4} shadow="lg">
                            {!onlyBid && (
                                <Box
                                    _hover={{
                                        bgColor: 'whiteAlpha.300',
                                        cursor: isBlocked ? 'not-allowed' : 'pointer',
                                    }}
                                    onClick={handleAsk}
                                    bgColor={bgMarkedColor}
                                    p={4}
                                    borderLeftRadius="lg"
                                    textAlign="center"
                                    fontSize="xl"
                                    borderRight="0px"
                                    borderBottom="1px"
                                    borderLeft="1px"
                                    borderTop="1px"
                                    borderColor={borderColor}>
                                    ASK
                                </Box>
                            )}
                            <Box
                                onClick={handleBid}
                                bgColor="whiteAlpha.100"
                                p={4}
                                borderRightRadius="lg"
                                borderLeftRadius={onlyBid ? 'lg' : '0px'}
                                textAlign="center"
                                fontSize="xl"
                                _hover={{ bgColor: borderColor, cursor: 'pointer' }}
                                borderRight="1px"
                                borderBottom="1px"
                                borderLeft="0px"
                                borderTop="1px"
                                borderColor={borderColor}>
                                BID
                            </Box>
                        </SimpleGrid>
                        <Box>
                            <AskAndBidGrid
                                cards={card || gemCards}
                                askOrders={card?.askOrders || gemCards?.askOrders}
                                bidOrders={card?.bidOrders || gemCards?.bidOrders}
                                onlyOneAsset={true}
                                username={username}
                                canDelete={false}
                            />
                        </Box>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialog>
            <AskDialog
                reference={refAsk}
                isOpen={isOpenAsk}
                onClose={onCloseAsk}
                card={!gemCards ? card : gemCards}
                username={username}
            />
            <BidDialog
                reference={refBid}
                isOpen={isOpenBid}
                onClose={onCloseBid}
                card={!gemCards ? card : gemCards}
                username={username}
                ignis={ignis}
            />
        </>
    );
};

export default TradeDialog;
