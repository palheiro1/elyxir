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
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import equal from 'fast-deep-equal';
import Crypto from 'crypto-browserify';

import HoverCard from '@darenft/react-3d-hover-card';
import '@darenft/react-3d-hover-card/dist/style.css';

/**
 * @name ItemReceived
 * @description Modal to show received items/potions
 * @param {Object} reference - Reference to the modal
 * @param {Boolean} isOpen - Boolean to know if the modal is open
 * @param {Function} onClose - Function to close the modal
 * @param {Array} items - Array of items received
 * @returns {JSX.Element} - JSX element
 */
const ItemReceived = ({ reference, isOpen, onClose, items }) => {
    const [currentItems, setCurrentItems] = useState([]);
    const [itemsHash, setItemsHash] = useState('');

    useEffect(() => {
        const check = () => {
            const hash = Crypto.createHash('sha256').update(JSON.stringify(items)).digest('hex');
            const hash2 = Crypto.createHash('sha256').update(JSON.stringify(currentItems)).digest('hex');
            if (!equal(hash, hash2)) {
                setCurrentItems(items);
            }
        };
        check();
    }, [items, currentItems]);

    const bgColor = useColorModeValue('#FFF', '#1D1D1D');
    const borderColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');
    const arrowColor = useColorModeValue('black', 'white');

    if (currentItems.length === 0) return null;

    const RenderItem = ({ item }) => {
        const { asset, amount } = item;
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
                            <Image src={asset.image} alt="Potion" maxH="25rem" />
                        </HoverCard>
                    </Center>
                    <SimpleGrid columns={1} mt={2}>
                        <Heading textAlign="center">{asset.name}</Heading>
                        <Center mt={2}>
                            <Stack direction="row" spacing={1}>
                                <Text
                                    px={2}
                                    fontSize="sm"
                                    bgColor="gray.600"
                                    rounded="lg"
                                    color="white">
                                    {asset.rarity}
                                </Text>
                                <Text
                                    px={2}
                                    fontSize="sm"
                                    bgColor="blue.600"
                                    rounded="lg"
                                    color="white">
                                    {asset.type}
                                </Text>
                            </Stack>
                        </Center>
                        <Center mt={2}>
                            <Text fontSize="sm" color="green.400">
                                +{asset.bonus} Power
                            </Text>
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
                    <AlertDialogHeader textAlign="center">POTION RECEIVED</AlertDialogHeader>
                    <AlertDialogCloseButton onClick={onClose} />
                    <AlertDialogBody mb={2}>
                        <Text textAlign="center" fontSize="sm" color="gray.400">
                            You have received new potions in your inventory!
                        </Text>

                        <SimpleGrid columns={currentItems.length > 1 ? 2 : 1} spacing={4}>
                            {currentItems.map((item, index) => (
                                <RenderItem key={index} item={item} />
                            ))}
                        </SimpleGrid>

                        <Center mt={6}>
                            <Button
                                colorScheme="blue"
                                w={{ base: '100%', md: '50%' }}
                                onClick={onClose}
                                fontWeight="bold">
                                COLLECT
                            </Button>
                        </Center>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ItemReceived;
