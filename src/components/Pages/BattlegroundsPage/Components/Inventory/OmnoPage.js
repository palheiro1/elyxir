import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import OmnoCards from './OmnoCards';
import { useCardsFilters } from '@hooks/useCardsFilters';
import CardFilters from './Components/CardsFilters';
import CardGrid from './Components/CardsGrid';
import { useSelector } from 'react-redux';

/**
 * @name OmnoPage
 * @description Component that renders the Battlegrounds card selection interface.
 * Allows the user to filter available cards by rarity, element, and continent, and select cards to send to the Army.
 * The selected cards are displayed in a dedicated list (`OmnoCards`) with options to edit or remove them.
 * Filters are applied based on the `soldiers` state and user's owned cards (with unconfirmed quantity > 0).
 * Responsive layout adjusts between mobile and desktop, and uses gridColumns to determine layout size.
 * @param {Object} props - Component props.
 * @param {Object} props.infoAccount - Info about the user's account (e.g., accountRs).
 * @param {boolean} props.isMobile - Whether the user is on a mobile device.
 * @param {Function} props.gridColumns - Function that returns the number of grid columns depending on screen size.
 * @param {Function} props.handleCloseInventory - Callback to close the inventory modal.
 * @returns {JSX.Element} Army card selector interface with filters, selectable cards and selected card panel.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const OmnoPage = ({ infoAccount, isMobile, gridColumns, handleCloseInventory }) => {
    const [selectedCards, setSelectedCards] = useState([]);

    const { cards } = useSelector(state => state.cards);
    const {
        filters,
        filteredNotSelectedCards,
        handleRarityChange,
        handleElementChange,
        handleDomainChange,
        handleReset,
    } = useCardsFilters({ selectedCards, cards });
    const handleSelectCard = card => setSelectedCards([...selectedCards, card]);

    const handleEdit = (card, quantity) => {
        setSelectedCards(prev => prev.map(c => (c.asset === card ? { ...c, selectQuantity: Number(quantity) } : c)));
    };

    const handleDeleteSelectedCard = card => {
        setSelectedCards(prev => prev.filter(c => c.asset !== card));
    };

    return (
        <>
            <Stack
                direction="column"
                color="#FFF"
                mb={isMobile ? 3 : 5}
                mt={isMobile && 2}
                mx="auto"
                textAlign="center">
                <Heading fontFamily="Chelsea Market, System" fontWeight={100} size={isMobile ? 'md' : 'xl'}>
                    ARMY
                </Heading>
                <Text fontSize={isMobile ? 'sm' : 'xl'}>
                    In order to play you will have to import your cards to battlegrounds
                </Text>
            </Stack>
            <Stack backgroundColor="#0F0F0F" borderRadius="20px" h={isMobile ? '78%' : '85%'} position={'relative'}>
                <Heading fontSize={isMobile ? 'md' : 'xl'} fontWeight="light" textAlign="center" mt={3}>
                    1. Select cards to send to Army
                </Heading>

                <CardFilters
                    isMobile={isMobile}
                    filters={filters}
                    handleRarityChange={handleRarityChange}
                    handleElementChange={handleElementChange}
                    handleDomainChange={handleDomainChange}
                    handleResetFilters={handleReset}
                />

                <Stack direction="row" pt={isMobile ? 0 : 2} padding={isMobile ? 0 : 5} height="inherit">
                    <Box
                        backgroundColor="#0F0F0F"
                        borderRadius="20px"
                        pt={isMobile && 0}
                        p={2}
                        w={isMobile ? '45%' : '65%'}
                        overflowY="scroll"
                        mx="auto"
                        display="flex"
                        justifyContent="center"
                        className="custom-scrollbar">
                        <CardGrid
                            cards={filteredNotSelectedCards}
                            onSelect={handleSelectCard}
                            gridColumns={gridColumns}
                            isMobile={isMobile}
                        />
                    </Box>

                    <Box
                        maxW={isMobile ? '50%' : '60%'}
                        backgroundColor="#0F0F0F"
                        borderRadius="20px"
                        p={4}
                        className="custom-scrollbar"
                        overflowX="scroll">
                        <OmnoCards
                            infoAccount={infoAccount}
                            isMobile={isMobile}
                            selectedCards={selectedCards}
                            setSelectedCards={setSelectedCards}
                            handleEdit={handleEdit}
                            handleDeleteSelectedCard={handleDeleteSelectedCard}
                            handleCloseInventory={handleCloseInventory}
                        />
                    </Box>
                </Stack>
            </Stack>
        </>
    );
};

export default OmnoPage;
