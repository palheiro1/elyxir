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
    useDisclosure,
    useToast,
} from '@chakra-ui/react';

import AskDialog from './AskDialog/AskDialog';
import BidDialog from './BidDialog/BidDialog';
import { errorToast } from '../../../utils/alerts';
import { NQTDIVIDER } from '../../../data/CONSTANTS';

const TradeDialog = ({ reference, isOpen, onClose, card, username, ignis, gemCards = false }) => {
    const toast = useToast();

    const { isOpen: isOpenAsk, onOpen: onOpenAsk, onClose: onCloseAsk } = useDisclosure();
    const refAsk = useRef();

    const { isOpen: isOpenBid, onOpen: onOpenBid, onClose: onCloseBid } = useDisclosure();
    const refBid = useRef();

    const handleAsk = () => {
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

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={onClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent
                    bgColor="#1D1D1D"
                    border="1px"
                    borderColor="whiteAlpha.400"
                    shadow="dark-lg">
                    <AlertDialogHeader textAlign="center" color="white">
                        <Center>
                            <Text>TRADE CARD</Text>
                        </Center>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        {!gemCards ? (
                            <Center rounded="lg" bgColor="whiteAlpha.100" p={4}>
                                <Stack direction="row" align="center" spacing={4}>
                                    <Image src={card.cardImgUrl} maxH="10rem" />
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold" color="white">
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
                                        <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="white">
                                            GEM
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            Quantity: {Number(gemCards.quantityQNT / NQTDIVIDER).toFixed(2)}
                                        </Text>
                                    </Box>
                                </Stack>
                            </Center>
                        )}
                        <SimpleGrid columns={2} my={4} shadow="lg">
                            <Box
                                onClick={handleAsk}
                                color="white"
                                bgColor="whiteAlpha.100"
                                p={4}
                                borderLeftRadius="lg"
                                textAlign="center"
                                fontSize="xl"
                                _hover={{ bgColor: 'whiteAlpha.300', cursor: 'pointer' }}
                                borderRight="0px"
                                borderBottom="1px"
                                borderLeft="1px"
                                borderTop="1px"
                                borderColor="whiteAlpha.300">
                                ASK
                            </Box>
                            <Box
                                onClick={handleBid}
                                color="white"
                                bgColor="whiteAlpha.100"
                                p={4}
                                borderRightRadius="lg"
                                textAlign="center"
                                fontSize="xl"
                                _hover={{ bgColor: 'whiteAlpha.300', cursor: 'pointer' }}
                                borderRight="1px"
                                borderBottom="1px"
                                borderLeft="0px"
                                borderTop="1px"
                                borderColor="whiteAlpha.300">
                                BID
                            </Box>
                        </SimpleGrid>
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
