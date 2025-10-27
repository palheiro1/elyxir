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
import { useSelector } from 'react-redux';

/**
 * @name CraftingConfirmation
 * @description Modal component that prompts the user to confirm a real blockchain crafting transaction.
 * Displays the selected recipe, its description, required ingredients with availability checks, and alerts the user that real assets will be used.
 * @param {Object} infoAccount - User account information, including owned assets.
 * @param {boolean} isOpen - Controls whether the modal is visible.
 * @param {Function} onClose - Callback to close the modal.
 * @param {Object} selectedRecipe - The recipe chosen for crafting.
 * @param {Function} confirmCrafting - Function executed when the user confirms the crafting action.
 * @param {boolean} isLoading - Indicates whether the crafting confirmation is currently processing.
 * @param {Object} selectedFlask - The selected flask, used to calculate ingredient multipliers.
 * @returns {JSX.Element} A modal displaying crafting confirmation details, required ingredients, and action buttons to cancel or start crafting.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CraftingConfirmation = ({
    infoAccount,
    isOpen,
    onClose,
    selectedRecipe,
    confirmCrafting,
    isLoading,
    selectedFlask,
}) => {
    const { items } = useSelector(state => state.items);

    const potions = items.filter(item => item.type === 'potion');
    const ingredients = items.filter(item => item.type === 'ingredient');

    const recipePotion = potions?.find(potion => potion?.asset === selectedRecipe?.creationAssetId);
    const multiplier = selectedFlask?.multiplier || 1;

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
                                    Recipe: {recipePotion?.description}
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
                                            const needed = ingredient.qtyQNT * multiplier;
                                            const hasEnough = available >= needed;

                                            const ing = ingredients?.find(item => {
                                                return item.asset === ingredient?.assetId;
                                            });

                                            return (
                                                <Stack direction={'row'} key={index} justify="space-between">
                                                    <Text fontSize="sm">{ing?.name}</Text>
                                                    <Text fontSize="sm" color={hasEnough ? 'green.500' : 'red.500'}>
                                                        {needed} needed ({available} available)
                                                    </Text>
                                                </Stack>
                                            );
                                        })}
                                </Stack>
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
