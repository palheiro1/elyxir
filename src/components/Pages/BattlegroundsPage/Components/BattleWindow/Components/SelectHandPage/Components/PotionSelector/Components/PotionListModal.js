import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Text,
} from '@chakra-ui/react';
import PotionListItem from './PotionListItem';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';

/**
 * @name PotionListModal
 * @description Modal component for selecting a battle potion. Displays a grid of available potions using `PotionListItem`.
 * Allows users to choose, clear, or confirm their potion selection. Responsive layout using `useBattlegroundBreakpoints`.
 * @param {Function} onPotionModalClose - Function to close the modal.
 * @param {Array<Object>} potions - Array of potion objects available for selection.
 * @param {Object|null} selectedPotion - Currently selected potion, or null if none selected.
 * @param {Function} handleSelectPotion - Function to set the selected potion; pass `null` to clear selection.
 * @returns {JSX.Element} Modal UI for potion selection in battlegrounds.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const PotionListModal = ({ onPotionModalClose, potions, selectedPotion, handleSelectPotion }) => {
    const { isMobile } = useBattlegroundBreakpoints();
    return (
        <Modal onClose={onPotionModalClose} size={isMobile ? 'md' : 'xl'} isOpen isCentered>
            <ModalOverlay />
            <ModalContent bgColor={'#1F2323'} border={'2px solid #D597B2'} borderRadius="xl" overflow={'hidden'}>
                <ModalHeader mx={'auto'} color={'#D597B2'} fontFamily={'Chelsea Market'}>
                    🧪 Choose Your Battle Potion
                </ModalHeader>
                <ModalCloseButton color={'#FFF'} />
                <ModalBody>
                    <Text color={'#FFF'} textAlign={'center'} mb={4} fontSize={'sm'} fontFamily={'Inter, system-ui'}>
                        Select a potion to enhance your creatures in battle. Each potion provides unique bonuses.
                    </Text>

                    <Box maxH={isMobile && '215px'} overflowY={isMobile && 'auto'}>
                        <SimpleGrid columns={2} spacing={4}>
                            {potions.map(potion => (
                                <PotionListItem
                                    key={potion.asset}
                                    selectedPotionAsset={selectedPotion?.asset}
                                    potion={potion}
                                    handleSelectPotion={handleSelectPotion}
                                />
                            ))}
                        </SimpleGrid>
                    </Box>

                    {potions.length === 0 && (
                        <Box textAlign="center" py={8}>
                            <Text color={'#FFF'} fontFamily={'Inter, system-ui'}>
                                No potions available. Earn potions from bounty rewards or pack openings!
                            </Text>
                        </Box>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" color={'#FFF'} onClick={onPotionModalClose} mr={3}>
                        Cancel
                    </Button>
                    {selectedPotion && (
                        <Button
                            colorScheme="red"
                            variant="outline"
                            onClick={() => {
                                handleSelectPotion(null);
                            }}
                            mr={3}>
                            Clear Selection
                        </Button>
                    )}
                    <Button colorScheme="purple" onClick={onPotionModalClose}>
                        Confirm Selection
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PotionListModal;
