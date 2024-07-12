import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Center,
    Heading,
    Image,
    SimpleGrid,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import Crypto from 'crypto-browserify';
import equals from 'fast-deep-equal';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import CardBadges from '../../Cards/CardBadges';

import HoverCard from "@darenft/react-3d-hover-card";
import "@darenft/react-3d-hover-card/dist/style.css";

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

    const bgColor = useColorModeValue('#FFF', '#1D1D1D');
    const borderColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');

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
                        <HoverCard scaleFactor={1.4}>
                            <Image src={asset.cardImgUrl} alt="Card Pack" maxH="25rem" />
                        </HoverCard>
                    </Center>
                    <SimpleGrid columns={1} mt={2}>
                        <Heading textAlign="center">{asset.name}</Heading>
                        <Center mt={2}>
                            <CardBadges rarity={asset.rarity} continent={asset.channel} />
                        </Center>
                        <Center mt={4}>
                            <Text fontSize="lg" color="gray.400">
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

                <AlertDialogContent bgColor={bgColor} border="1px" borderColor={borderColor} shadow="dark-lg">
                    <AlertDialogHeader textAlign="center">CARD RECEIVED</AlertDialogHeader>
                    <AlertDialogCloseButton onClick={onClose} />
                    <AlertDialogBody mb={2}>
                        <Text textAlign="center" fontSize="sm" color="gray.400">
                            You have received new cards in your inventory!
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
                                CLOSE
                            </Button>
                        </Center>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default CardReceived;
