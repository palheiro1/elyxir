import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCardsFilters } from '../../../../../hooks/useCardsFilters';
import CardFilters from './Components/CardsFilters';
import CardGrid from './Components/CardsGrid';
import ArdorCards from './ArdorCards';

/**
 * @name ArdorPage
 * @description UI component that renders the user's available cards to send back to the inventory from the army (Omno).
 * It allows filtering cards by rarity, element, and continent, and lets the user select cards to be sent.
 * Includes a preview of selected cards and integrates the `ArdorCards` component for confirmation and dispatch.
 * The component manages selected cards and filters locally, uses Redux to retrieve card data, and is responsive to mobile layout.
 * @param {Object} infoAccount - Object with user account info, used for PIN validation and transactions.
 * @param {boolean} isMobile - Whether the layout is mobile-sized; affects layout and spacing.
 * @param {Function} gridColumns - Callback that returns number of columns for responsive card grid layout.
 * @param {Function} handleCloseInventory - Callback to close the inventory modal after a successful action.
 * @returns {JSX.Element} ArdorPage card selection interface.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const ArdorPage = ({ infoAccount, isMobile, gridColumns, handleCloseInventory }) => {
    const [selectedCards, setSelectedCards] = useState([]);
    const { filteredCards: baseCards } = useSelector(state => state.battlegrounds);

    const { filteredNotSelectedCards, notSelectedCards, handleRarityChange, handleElementChange, handleDomainChange } =
        useCardsFilters(selectedCards, baseCards);

    const handleSelectCard = card => {
        setSelectedCards([...selectedCards, card]);
    };

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
                    INVENTORY
                </Heading>
                <Text fontSize={isMobile ? 'sm' : 'xl'}>
                    Here you can withdraw your cards from the army to your inventory
                </Text>
            </Stack>

            <Stack backgroundColor="#0F0F0F" borderRadius="20px" h={isMobile ? '78%' : '85%'}>
                <Heading fontSize={isMobile ? 'md' : 'xl'} fontWeight="light" textAlign="center" mt={3}>
                    1. Select cards to send to Inventory
                </Heading>

                <CardFilters
                    isMobile={isMobile}
                    handleRarityChange={handleRarityChange}
                    handleElementChange={handleElementChange}
                    handleDomainChange={handleDomainChange}
                />

                <Stack direction="row" pt={2} padding={5} height="inherit">
                    <Box
                        backgroundColor="#0F0F0F"
                        borderRadius="20px"
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
                            quantityKey="omnoQuantity"
                            emptyText="You don’t have more cards"
                        />
                    </Box>

                    <Box
                        maxW={isMobile ? '50%' : '60%'}
                        backgroundColor="#0F0F0F"
                        borderRadius="20px"
                        p={4}
                        className="custom-scrollbar"
                        overflowX="scroll">
                        <ArdorCards
                            infoAccount={infoAccount}
                            cards={baseCards}
                            isMobile={isMobile}
                            selectedCards={selectedCards}
                            setSelectedCards={setSelectedCards}
                            notSelectedCards={notSelectedCards}
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

export default ArdorPage;
