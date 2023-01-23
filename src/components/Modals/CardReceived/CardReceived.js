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
} from '@chakra-ui/react';

import Hover from 'react-3d-hover';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const CardReceived = ({ reference, isOpen, onClose, cards }) => {
    console.log('🚀 ~ file: CardReceived.js:19 ~ CardReceived ~ cards', cards);

    if (cards.length === 0) return null;

    const RenderCard = ({ card }) => {
        return (
            <Center>
                <SimpleGrid columns={1} py={4} px={6} mt={4} border="1px" rounded="lg" shadow="lg" borderColor="whiteAlpha.400">
                    <Center w="100%">
                        <Hover scale={1.075} perspective={200}>
                            <Image src={card.cardImgUrl} alt="Card Pack" maxH="25rem" />
                        </Hover>
                    </Center>
                    <SimpleGrid columns={1} mt={2}>
                        <Heading textAlign="center">{card.name}</Heading>
                        <Text textAlign="center">
                            {card.channel} / {card.rarity}
                        </Text>
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
                    <AlertDialogCloseButton />
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
