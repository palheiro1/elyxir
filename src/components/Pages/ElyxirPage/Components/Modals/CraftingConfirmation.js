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
    const { fakeAssets } = useSelector(state => state.elyxir);
    const { potions } = fakeAssets;
    const recipePotion = potions?.find(potion => potion?.asset === selectedRecipe?.creationAssetId) || {
        name: 'Selected potion',
        description: 'Elyxir potion',
    };
    const multiplier = selectedFlask?.multiplier || 1;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay bg="blackAlpha.800" />
            <ModalContent bg="#10171b" color="white" border="1px solid" borderColor="whiteAlpha.200">
                <ModalHeader>Confirm crafting</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {selectedRecipe && (
                        <Stack direction={'column'} spacing={4} align="stretch">
                            <Alert
                                status="info"
                                borderRadius="8px"
                                bg="rgba(87, 214, 141, 0.1)"
                                color="white"
                                border="1px solid"
                                borderColor="rgba(87, 214, 141, 0.24)"
                            >
                                <AlertIcon />
                                <Box>
                                    <AlertTitle>Wallet approval required</AlertTitle>
                                    <AlertDescription>
                                        This craft spends the listed assets and the wallet host will ask you to approve
                                        each transaction.
                                    </AlertDescription>
                                </Box>
                            </Alert>

                            <Box>
                                <Text fontWeight="bold" mb={2}>
                                    Recipe: {recipePotion.name}
                                </Text>
                                <Text fontSize="sm" color="whiteAlpha.600" mb={4}>
                                    {recipePotion.description}
                                </Text>
                            </Box>

                            <Divider borderColor="whiteAlpha.200" />

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

                                            const ing = fakeAssets?.ingredients?.find(item => {
                                                return item.asset === ingredient?.assetId;
                                            });

                                            return (
                                                <Stack
                                                    direction={'row'}
                                                    key={index}
                                                    justify="space-between"
                                                    bg="#0b1114"
                                                    border="1px solid"
                                                    borderColor="whiteAlpha.200"
                                                    borderRadius="8px"
                                                    p={2}
                                                >
                                                    <Text fontSize="sm">{ing?.name}</Text>
                                                    <Text fontSize="sm" color={hasEnough ? '#57d68d' : '#f6ad55'}>
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
                    <Button variant="ghost" color="whiteAlpha.800" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button bg="#57d68d" color="#07100c" _hover={{ bg: '#46c47d' }} onClick={confirmCrafting} isLoading={isLoading}>
                        Start Crafting
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CraftingConfirmation;
