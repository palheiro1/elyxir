import { Box, Img, Stack, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import './BattlegroundMap.css';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import { ScrollLock } from './assets/ScrollLock';
import { Maps } from './Components/Maps';
import BattlegroundCurrencies from './Components/BattlegroundCurrencies';
import BattlegroundFilters from './Components/BattlegroundFilters';
import BattlegroundMenu from './Components/BattlegroundMenu';
import BattlegroundStatistics from './Components/BattlegroundStatistics';
import BattlegroundModals from './Components/BattlegroundModals';
import Rewards from './Components/Rewards';

import { useBattlegroundState } from '@hooks/useBattlegroundState';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';

/**
 * @name Battlegrounds
 * @description Main component for the Battlegrounds section. It handles the layout and state for displaying the 
 * interactive battle map, currencies, filters, statistics, modals, and rewards.
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
                    <Stack direction="row" h="100%">
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
                                direction={'row'}
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
