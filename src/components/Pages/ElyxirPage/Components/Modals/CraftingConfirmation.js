import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Divider,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
} from '@chakra-ui/react';

const CraftingConfirmation = ({
    infoAccount,
    isOpen,
    onClose,
    selectedRecipe,
    confirmCrafting,
    isLoading,
    selectedFlask,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirm Real Crafting</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {selectedRecipe && (
                        <Stack direction={'column'} spacing={4} align="stretch">
                            <Alert status="info" borderRadius="md">
                                <AlertIcon />
                                <Box>
                                    <AlertTitle>Real Blockchain Transaction!</AlertTitle>
                                    <AlertDescription>
                                        This will use real assets from your account and create actual blockchain
                                        transactions.
                                    </AlertDescription>
                                </Box>
                            </Alert>

                            <Box>
                                <Text fontWeight="bold" mb={2}>
                                    Recipe: {selectedRecipe.name}
                                </Text>
                                <Text fontSize="sm" color="gray.600" mb={4}>
                                    {selectedRecipe.description}
                                </Text>
                            </Box>

                            <Divider />

                            <Box>
                                <Text fontWeight="bold" mb={2}>
                                    Required Ingredients:
                                </Text>
                                <Stack direction={'column'} spacing={2} align="stretch">
                                    {selectedRecipe.ingredients &&
                                        selectedRecipe.ingredients.map((ingredient, index) => {
                                            const userAsset = infoAccount?.assets?.find(
                                                asset => asset.asset === ingredient.assetId
                                            );
                                            const available = userAsset ? parseInt(userAsset.quantityQNT) : 0;
                                            const needed = ingredient.baseQNT * selectedFlask.multiplier;
                                            const hasEnough = available >= needed;

                                            return (
                                                <Stack direction={'row'} key={index} justify="space-between">
                                                    <Text fontSize="sm">{ingredient.name}</Text>
                                                    <Text fontSize="sm" color={hasEnough ? 'green.500' : 'red.500'}>
                                                        {needed} needed ({available} available)
                                                    </Text>
                                                </Stack>
                                            );
                                        })}
                                </Stack>
                            </Box>

                            <Box>
                                <Text fontWeight="bold" mb={2}>
                                    Crafting Details:
                                </Text>
                                <Text fontSize="sm">Duration: {selectedRecipe.duration || 30} minutes</Text>
                                <Text fontSize="sm">Success Rate: {Math.round(selectedRecipe.successRate || 80)}%</Text>
                                <Text fontSize="sm">Fee: {selectedRecipe.fee || 0.1} ARDOR</Text>
                            </Box>
                        </Stack>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="purple" onClick={confirmCrafting} isLoading={isLoading}>
                        Start Crafting
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CraftingConfirmation;
