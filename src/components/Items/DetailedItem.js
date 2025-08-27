import {
    Box,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';

import HoverCard from '@darenft/react-3d-hover-card';
import '@darenft/react-3d-hover-card/dist/style.css';
import { getTypeValue, getColor } from './data';

/**
 * @name DetailedItem
 * @description Modal to show the details of an item/potion
 * @param {Boolean} isOpen - Boolean to know if the modal is open
 * @param {Function} onClose - Function to close the modal
 * @param {Object} data - Object with the item data
 * @returns {JSX.Element} - JSX element
 */
const DetailedItem = ({ isOpen, onClose, data }) => {
    const textColor = useColorModeValue('gray.200', 'gray.200');

    if (!data) return null;

    const { name, imgUrl, bonus, description } = data;

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered="true">
                <ModalOverlay bgColor="blackAlpha.900" />
                <ModalContent
                    p={2}
                    px={{ base: 4, lg: 12 }}
                    bgColor="#1D1D1D"
                    shadow="dark-lg"
                    border="1px"
                    borderColor="whiteAlpha.400">
                    <ModalCloseButton color="white" />
                    <Stack direction={{ base: 'column', lg: 'row' }}>
                        <Box mt="6%">
                            <HoverCard scaleFactor={1.4}>
                                <Image
                                    src={imgUrl}
                                    alt={name}
                                    maxH={{ base: '21rem', lg: '42rem' }}
                                    rounded="lg"
                                    mx={'auto'}
                                />
                            </HoverCard>
                        </Box>

                        <Stack direction="column" align="center" w="100%">
                            <ModalBody color={textColor} w="100%">
                                <Text color="white" fontSize="4xl" fontWeight="bolder">
                                    {description}
                                </Text>

                                <Stack direction="row" mb={2} justify="space-between">
                                    <Stack direction="column" spacing={0}>
                                        <Text fontSize="md" color="gray">
                                            Type
                                        </Text>
                                        <Text
                                            fontSize="md"
                                            bgColor={getColor(bonus)}
                                            rounded="lg"
                                            color="white"
                                            textTransform={'capitalize'}
                                            px={2}
                                            textAlign="center">
                                            {bonus.type} ({getTypeValue(bonus)})
                                        </Text>
                                    </Stack>

                                    <Stack direction="column" spacing={0}>
                                        <Text fontSize="md" color="gray">
                                            Bonus
                                        </Text>
                                        <Text
                                            fontSize="md"
                                            bgColor="green.600"
                                            rounded="lg"
                                            color="white"
                                            px={2}
                                            textAlign="center">
                                            +{bonus.power} Power
                                        </Text>
                                    </Stack>
                                </Stack>

                                <Box mt={4}>
                                    <Text fontSize="lg" fontWeight="bold" color="white" mb={2}>
                                        Usage
                                    </Text>
                                    <Text fontSize="md" color="gray" textAlign="justify">
                                        This potion can be equipped before battle to provide a +{bonus.power} power
                                        bonus to creatures that match the {bonus.type} condition. Single use only - the
                                        potion is consumed after the battle.
                                    </Text>
                                </Box>
                            </ModalBody>
                        </Stack>
                    </Stack>
                </ModalContent>
            </Modal>
        </>
    );
};

export default DetailedItem;
