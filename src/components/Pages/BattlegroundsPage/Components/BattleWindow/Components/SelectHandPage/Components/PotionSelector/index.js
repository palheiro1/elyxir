import { Box, Stack, Text, useDisclosure } from '@chakra-ui/react';
import SelectedPotion from './Components/SelectedPotion';
import { mockPotions } from './data';
import PotionPlaceholder from './Components/PotionPlaceholder';
import PotionListModal from './Components/PotionListModal';

/**
 * @name PotionSelector
 * @description Component for selecting and managing battle potions.
 * Displays the currently selected potion or a placeholder for selection.
 * Includes a modal for potion selection with detailed information.
 * @param {Object|null} selectedPotion - Currently selected potion object
 * @param {Function} setSelectedPotion - Function to set the selected potion
 * @param {boolean} isMobile - Flag indicating if the display is on a mobile device
 * @returns {JSX.Element} JSX layout for potion selection
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const PotionSelector = ({ selectedPotion, setSelectedPotion, isMobile }) => {
    const { isOpen: isPotionModalOpen, onOpen: onPotionModalOpen, onClose: onPotionModalClose } = useDisclosure();

    const handleSelectPotion = potion => {
        setSelectedPotion(potion);
        onPotionModalClose();
    };

    return (
        <>
            <Box
                w={'80%'}
                mx={'auto'}
                mt={isMobile ? 4 : 6}
                p={4}
                borderRadius="md"
                border="2px solid #D597B2"
                background="rgba(208, 143, 176, 0.1)">
                <Stack direction={'row'} justifyContent={'space-between'} align={'center'}>
                    <Text
                        color={'#D597B2'}
                        textAlign={'center'}
                        my={'auto'}
                        fontFamily={'Chelsea Market, system-ui'}
                        fontSize={isMobile ? 'md' : 'large'}>
                        🧪 BATTLE POTION
                    </Text>
                    <Stack direction={'row'} spacing={3} align={'center'}>
                        {selectedPotion ? (
                            <SelectedPotion
                                onPotionModalOpen={onPotionModalOpen}
                                selectedPotion={selectedPotion}
                                setSelectedPotion={setSelectedPotion}
                            />
                        ) : (
                            <PotionPlaceholder onPotionModalOpen={onPotionModalOpen} />
                        )}
                    </Stack>
                </Stack>
            </Box>

            {isPotionModalOpen && (
                <PotionListModal
                    onPotionModalClose={onPotionModalClose}
                    potions={mockPotions}
                    selectedPotion={selectedPotion}
                    handleSelectPotion={handleSelectPotion}
                />
            )}
        </>
    );
};

export default PotionSelector;
