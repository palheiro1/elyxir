import { Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text, useColorModeValue } from "@chakra-ui/react";

import Hover from 'react-3d-hover';

/**
 * @name DetailedCard
 * @description Modal to show the details of a card
 * @param {Boolean} isOpen - Boolean to know if the modal is open
 * @param {Function} onClose - Function to close the modal
 * @param {Object} data - Object with the card data
 * @returns {JSX.Element} - JSX to display
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const DetailedCard = ({ isOpen, onClose, data }) => {

    const { name, cardImgUrl:image, channel:continent, rarity, description } = data;

    const textColor = useColorModeValue("gray.200", "gray.200")

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
                <ModalOverlay />
                <ModalContent p={8} backgroundColor="blackAlpha.900" border="1px" rounded="3xl" borderTop="2px" borderBottom="2px" shadow="dark-lg">
                    <Stack direction="row">
                        <Hover perspective={300}>
                            <Image src={image} alt={name} minW="50%" rounded="lg" />
                        </Hover>

                        <Stack direction="column">
                            <ModalHeader>
                                <Text color="white" fontSize="3xl" fontWeight="bolder">{name}</Text>
                                <Text fontSize="md" color="gray">{continent} / {rarity}</Text>
                            </ModalHeader>
                            <ModalCloseButton />

                            <ModalBody color={textColor}>
                                {description}
                            </ModalBody>
                        </Stack>
                    </Stack>
                </ModalContent>
            </Modal>
        </>
    );
};

export default DetailedCard;
