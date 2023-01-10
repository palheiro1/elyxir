import { Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text } from "@chakra-ui/react";

const DetailedCard = ({ isOpen, onClose, data }) => {
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
                <ModalOverlay />
                <ModalContent p={6} backgroundColor="blackAlpha.900" border="1px" rounded="3xl" borderTop="2px" borderBottom="2px" shadow="dark-lg">
                    <Stack direction="row">
                        <Image src={data.image} alt={data.name} minW="50%" />

                        <Stack direction="column">
                            <ModalHeader>
                                <Text fontSize="3xl" fontWeight="bolder">{data.name}</Text>
                                <Text fontSize="md" color="gray">{data.continent} / {data.rarity}</Text>
                            </ModalHeader>
                            <ModalCloseButton />

                            <ModalBody>
                                {data.description}
                            </ModalBody>
                        </Stack>
                    </Stack>
                </ModalContent>
            </Modal>
        </>
    );
};

export default DetailedCard;
