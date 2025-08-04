import { Box, Img, Stack, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import './BattlegroundMap.css';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import { Maps } from './Components/Maps';
import { ScrollLock } from './assets/ScrollLock';
import BattlegroundCurrencies from './Components/BattlegroundCurrencies';
import BattlegroundFilters from './Components/BattlegroundFilters';
import { useBattlegroundState } from '../../../hooks/useBattlegroundState';
import BattlegroundMenu from './Components/BattlegroundMenu';
import BattlegroundStatistics from './Components/BattlegroundStatistics';
import BattlegroundModals from './Components/BattlegroundModals';
import Rewards from './Components/Rewards';
import { useBattlegroundBreakpoints } from '../../../hooks/useBattlegroundBreakpoints';

/**
 * @name Battlegrounds
 * @description Main component for the Battlegrounds section. It handles the layout and state for displaying the interactive battle map, currencies, filters, statistics, modals, and rewards.
 * @param {Object} infoAccount - User account information used to configure modals and card filtering logic.
 * @returns {JSX.Element} The main UI for the battlegrounds feature, including maps, card filters, modals, and statistics.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const Battlegrounds = ({ infoAccount }) => {
    const {
        modals,
        isScrollLocked,
        selectedArena,
        handleOpenModal,
        handleCloseModal,
        setSelectedArena,
        onCloseGems,
        onCloseWeth,
        isOpenGems,
        isOpenWeth,
        gemsModalMode,
        wethModalMode,
        handleOpenGemsModal,
        handleOpenWethModal,
        filters,
        handleFilterChange,
        handleResetFilters,
        statistics,
        omnoGEMsBalance,
        omnoWethBalance,
        parseWETH,
        filteredCards,
        IGNISBalance,
        setHasSeenNewPlayersModal,
    } = useBattlegroundState(infoAccount);
    const { cards } = useSelector(state => state.cards);

    const { isMobile, isMediumScreen } = useBattlegroundBreakpoints();

    // Mock items for battlegrounds
    const mockItems = [
        {
            id: 'pot1',
            name: 'Lava Elixir',
            image: '/images/items/Lava copia.png',
            medium: 'Terrestrial',
            type: 'Buff',
            description: '+1 Power to Terrestrial creatures',
            quantity: 3,
            bonus: { medium: 'Terrestrial', value: 1 },
        },
        {
            id: 'pot2',
            name: 'Wind Essence',
            image: '/images/items/Wind copia.png',
            medium: 'Aerial',
            type: 'Buff',
            description: '+1 Power to Aerial creatures',
            quantity: 2,
            bonus: { medium: 'Aerial', value: 1 },
        },
        {
            id: 'pot3',
            name: 'Aquatic Essence',
            image: '/images/items/Water sea.png',
            medium: 'Aquatic',
            type: 'Buff',
            description: '+1 Power to Aquatic creatures',
            quantity: 2,
            bonus: { medium: 'Aquatic', value: 1 },
        },
    ];

    useEffect(() => {
        if (!hasSeenNewPlayersModal && !loading) {
            if (filteredCards === null || filteredCards?.length === 0) {
                setOpenNewPlayersModal(true);
            } else {
                setHasSeenNewPlayersModal(true);
            }
        }
    }, [filteredCards, loading, hasSeenNewPlayersModal]);

    document.title = 'Mythical Beings | Battlegrounds';

    return (
        <>
            <Box
                className="landscape-only"
                maxH="100vh"
                h="100vh"
                overflowY="auto"
                overflowX="hidden"
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgImage="url('/images/battlegrounds/battlegroundsBackground.png')"
                bgSize="cover"
                bgRepeat="no-repeat"
                bgPosition="center">
                <BattlegroundModals
                    infoAccount={infoAccount}
                    modals={modals}
                    selectedArena={selectedArena}
                    cards={cards}
                    filteredCards={filteredCards}
                    omnoGEMsBalance={omnoGEMsBalance}
                    omnoWethBalance={omnoWethBalance}
                    isOpenGems={isOpenGems}
                    isOpenWeth={isOpenWeth}
                    gemsModalMode={gemsModalMode}
                    wethModalMode={wethModalMode}
                    handleCloseModal={handleCloseModal}
                    handleOpenModal={handleOpenModal}
                    onCloseGems={onCloseGems}
                    onCloseWeth={onCloseWeth}
                    setHasSeenNewPlayersModal={setHasSeenNewPlayersModal}
                    handleFilterChange={handleFilterChange}
                />

                <ScrollLock isLocked={isScrollLocked} />
                <Box position="relative" pl={4} pt={4} boxSize="fit-content" my="auto" w={'100%'}>
                    <Stack direction="row" h="100%" mb="50px">
                        <Stack direction="column" w="20%">
                            <Img
                                src="/images/battlegrounds/battlegroundsLogo.svg"
                                w="250px"
                                mx="auto"
                                mt={isMobile && 2}
                            />
                            <Rewards mx="auto" />
                            <BattlegroundMenu setOpenModal={handleOpenModal} />
                        </Stack>
                        <Stack mx="auto" w="100%">
                            <Stack
                                direction={isMobile ? 'row' : 'row'}
                                fontFamily="Chelsea Market, system-ui"
                                mx="auto"
                                flexWrap={'wrap'}
                                mt={isMobile && 2}
                                ml={isMobile && 5}
                                w={isMediumScreen || isMobile ? '90%' : '85%'}
                                align={'center'}
                                justifyContent="space-between">
                                <BattlegroundCurrencies
                                    isMobile={isMobile}
                                    IGNISBalance={IGNISBalance}
                                    parseWETH={parseWETH}
                                    omnoGEMsBalance={omnoGEMsBalance}
                                    handleOpenWethModal={handleOpenWethModal}
                                    handleOpenGemsModal={handleOpenGemsModal}
                                />
                                <BattlegroundFilters
                                    filters={filters}
                                    handleFilterChange={handleFilterChange}
                                    handleResetFilters={handleResetFilters}
                                />
                            </Stack>

                            <Maps
                                handleSelectArena={setSelectedArena}
                                infoAccount={infoAccount}
                                cards={cards}
                                handleStartBattle={() => handleOpenModal('battle')}
                                filters={filters}
                                w="100%"
                            />

                            <BattlegroundStatistics statistics={statistics} isMobile={isMobile} />
                        </Stack>
                    </Stack>
                </Box>
            </Box>
            <Box className="rotate-device" zIndex={999}>
                <Text>Please rotate your device to landscape mode to view this content.</Text>
            </Box>
        </>
    );
};

export default Battlegrounds;
