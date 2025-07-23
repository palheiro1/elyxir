import { useEffect, useState } from 'react';
import { Heading, Stack } from '@chakra-ui/react';
import BattleDetails from './BattleDetails';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBattles } from '../../../../../redux/reducers/BattleReducer';
import BattleListTable from './BattleListTable';
import { useBattlegroundBreakpoints } from '../../../../../hooks/useBattlegroundBreakpoints';
import Modal from '../../../../ui/Modal';

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

    const ModalWidth = isMobile || isMediumScreen ? '100%' : viewDetails ? '50%' : '70%';
    const ModalHeight = isMobile || isMediumScreen ? '100%' : viewDetails ? '95%' : '90%';

    return (
        <Modal isVisible width={ModalWidth} height={ModalHeight} overflowY={'hidden'} onClose={closeRecord}>
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
        </Modal>
    );
};

export default BattleRecord;
