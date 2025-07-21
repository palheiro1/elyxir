import { useEffect, useState } from 'react';
import { Overlay } from '../../../../ui/Overlay';
import { Box, Heading, IconButton, Stack } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import BattleDetails from './BattleDetails';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBattles } from '../../../../../redux/reducers/BattleReducer';
import BattleListTable from './BattleListTable';
import { useBattlegroundBreakpoints } from '../../../../../hooks/useBattlegroundBreakpoints';

/**
 * @name BattleRecord
 * @description
 * React component that displays a modal-like battle record overlay. It fetches and shows
 * the user's battles with options to view detailed information of a selected battle.
 * @param {Object} props - React props.
 * @param {function} props.handleClose - Callback to close the battle record overlay.
 * @param {Object} props.infoAccount - User account information, includes `accountRs` (address).
 * @param {Array} props.cards - Cards data passed down to child components.
 * @param {boolean} props.isMobile - Flag indicating if the UI is in mobile mode.
 * @returns {JSX.Element} JSX element rendering the battle record modal.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleRecord = ({ handleClose, infoAccount, cards }) => {
    const { accountRs } = infoAccount;
    const dispatch = useDispatch();

    const { arenasInfo, userBattles, battleRewards } = useSelector(state => state.battle);
    const [viewDetails, setViewDetails] = useState(false);
    const [selectedBattle, setSelectedBattle] = useState(null);
    const [selectedArena, setSelectedArena] = useState(null);

    const { isMobile, isMediumScreen } = useBattlegroundBreakpoints();

    useEffect(() => {
        if (accountRs) dispatch(fetchUserBattles(accountRs));
    }, [accountRs, dispatch]);

    const handleViewDetails = battleId => {
        const selected = userBattles.find(battle => battle.battleId === battleId);
        const arena = arenasInfo.find(arena => arena.id === selected.arenaId);
        setSelectedBattle(battleId);
        setSelectedArena(arena);
        setViewDetails(true);
    };

    const handleGoBack = () => {
        setSelectedBattle(null);
        setViewDetails(false);
    };

    const closeRecord = () => {
        setSelectedBattle(null);
        setViewDetails(false);
        handleClose();
    };

    return (
        <>
            <Overlay isVisible={true} handleClose={closeRecord} />
            <Box
                pos="fixed"
                bgColor="#1F2323"
                zIndex={99}
                w={isMobile || isMediumScreen ? '100%' : viewDetails ? '50%' : '70%'}
                h={isMobile || isMediumScreen ? '100%' : viewDetails ? '95%' : '90%'}
                borderRadius="25px"
                overflowY="hidden"
                className="custom-scrollbar"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)">
                <IconButton
                    background="transparent"
                    color={viewDetails ? '#000' : '#FFF'}
                    icon={<CloseIcon />}
                    _hover={{ background: 'transparent' }}
                    position="absolute"
                    top={2}
                    right={2}
                    zIndex={999}
                    onClick={closeRecord}
                />

                {!viewDetails ? (
                    <>
                        <Stack direction="column" color="#FFF" my={5} mx="auto" textAlign="center" maxH="90%">
                            <Heading fontFamily="Chelsea Market, System" fontWeight={100} fontSize="2xl">
                                BATTLE RECORD
                            </Heading>
                        </Stack>
                        <BattleListTable
                            battleDetails={userBattles}
                            handleViewDetails={handleViewDetails}
                            cards={cards}
                            isMobile={isMobile}
                            battleRewards={battleRewards}
                        />
                    </>
                ) : (
                    <BattleDetails
                        battleId={selectedBattle}
                        cards={cards}
                        arenaInfo={selectedArena}
                        infoAccount={infoAccount}
                        battleDetails={userBattles.find(b => b.battleId === selectedBattle)}
                        handleGoBack={handleGoBack}
                        battleRewards={battleRewards?.[selectedBattle]}
                        isMobile={isMobile}
                        isMediumScreen={isMediumScreen}
                    />
                )}
            </Box>
        </>
    );
};

export default BattleRecord;
