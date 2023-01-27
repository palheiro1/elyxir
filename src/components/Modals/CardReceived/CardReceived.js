import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    SimpleGrid,
    Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import Hover from 'react-3d-hover';

import Crypto from 'crypto-browserify';
import equals from 'fast-deep-equal';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { RARITY_COLORS } from '../../../data/CONSTANTS';

const CardReceived = ({ reference, isOpen, onClose, cards }) => {
    const [currentCards, setCurrentCards] = useState(cards);

    useEffect(() => {
        const check = () => {
            const hash = Crypto.createHash('sha256').update(JSON.stringify(cards)).digest('hex');
            const hash2 = Crypto.createHash('sha256').update(JSON.stringify(currentCards)).digest('hex');
            if (!equals(hash, hash2)) {
                setCurrentCards(cards);
            }
        };
        check();
    }, [cards, currentCards]);

    if (currentCards.length === 0) return null;

    const RenderCard = ({ card }) => {
        const { asset, amount } = card;
        return (
            <Center>
                <SimpleGrid
                    columns={1}
                    py={4}
                    px={6}
                    mt={4}
                    border="1px"
                    rounded="lg"
                    shadow="lg"
                    borderColor="whiteAlpha.400">
                    <Center w="100%">
                        <Hover scale={1.075} perspective={200}>
                            <Image src={asset.cardImgUrl} alt="Card Pack" maxH="25rem" />
                        </Hover>
                    </Center>
                    <SimpleGrid columns={1} mt={2}>
                        <Heading textAlign="center">{asset.name}</Heading>
                        <Center mt={2}>
                            <Flex gap={2}>
                                <Text
                                    color="white"
                                    fontSize="md"
                                    rounded="lg"
                                    fontWeight="bolder"
                                    bgColor="whiteAlpha.300"
                                    px={2}>
                                    {asset.channel}
                                </Text>
                                <Text
                                    fontWeight="bolder"
                                    color="black"
                                    fontSize="md"
                                    bgGradient={RARITY_COLORS[asset.rarity]}
                                    rounded="lg"
                                    px={2}>
                                    {asset.rarity}
                                </Text>
                            </Flex>
                        </Center>
                        <Center>
                            <Text fontSize="md" color="gray.400">
                                {amount}x
                            </Text>
                        </Center>
                    </SimpleGrid>
                </SimpleGrid>
            </Center>
        );
    };

    return (
        <>
            <AlertDialog
                size="xl"
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={onClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent bgColor="#1D1D1D" border="1px" borderColor="whiteAlpha.400" shadow="dark-lg">
                    <AlertDialogHeader textAlign="center">CARD RECEIVED</AlertDialogHeader>
                    <AlertDialogCloseButton onClick={onClose} />
                    <AlertDialogBody mb={2}>
                        <Text textAlign="center" fontSize="sm" color="gray.400">
                            You have received {cards.length} new card{cards.length > 1 ? 's' : ''} in your inventory!
                        </Text>
                        <Carousel
                            infiniteLoop
                            centerMode={true}
                            showIndicators={false}
                            showThumbs={false}
                            showStatus={false}>
                            {cards.map((card, index) => (
                                <RenderCard key={index} card={card} />
                            ))}
                        </Carousel>
                        <Center>
                            <Button w="60%" size="lg" ref={reference} onClick={onClose} mt={4}>
                                SHOW INVENTORY
                            </Button>
                        </Center>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default CardReceived;
