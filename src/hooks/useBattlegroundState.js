import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { isNotLogged } from '../utils/validators';
import { fetchArenasInfo } from '../redux/reducers/ArenasReducer';
import { fetchBattleData, updateFilteredCards } from '../redux/reducers/BattlegroundsReducer';
import { fetchSoldiers } from '../redux/reducers/SoldiersReducer';
import { fetchUserBattles } from '../redux/reducers/BattleReducer';
import { fetchLeaderboards } from '../redux/reducers/LeaderboardsReducer';
import { getBlockchainBlocks } from '../redux/reducers/BlockchainReducer';
import { REFRESH_BLOCK_TIME } from '../data/CONSTANTS';
import { cleanStuckedBattleCards } from '../components/Pages/BattlegroundsPage/Utils/BattlegroundsUtils';
import { fetchItems } from '../redux/reducers/ItemsReducer';

/**
 * @name useBattlegroundState
 * @description Custom hook to manage the complete state and behavior logic of the Battlegrounds game feature. It handles modals, filters, screen sizes, blockchain updates, and battle data fetching.
 * @param {Object} infoAccount - Contains user blockchain info like `accountRs` and `IGNISBalance`.
 * @returns {Object} All state values, handlers, filters, media queries and stats used by the `Battlegrounds` component.
 * @returns {Object} return
 * @returns {Object} return.modals - State object to track visibility of various modals.
 * @returns {boolean} return.isScrollLocked - Indicates whether scroll is locked when a modal is open.
 * @returns {string} return.selectedArena - Currently selected arena ID.
 * @returns {Function} return.setSelectedArena - Setter for `selectedArena`.
 * @returns {Function} return.handleOpenModal - Opens a modal by key name and locks scroll.
 * @returns {Function} return.handleCloseModal - Closes a modal by key name and refreshes state.
 * @returns {Function} return.onOpenGems - Chakra disclosure opener for GEM modal.
 * @returns {Function} return.onOpenWeth - Chakra disclosure opener for WETH modal.
 * @returns {Function} return.onCloseGems - Chakra disclosure closer for GEM modal.
 * @returns {Function} return.onCloseWeth - Chakra disclosure closer for WETH modal.
 * @returns {boolean} return.isOpenGems - Chakra state for GEM modal visibility.
 * @returns {boolean} return.isOpenWeth - Chakra state for WETH modal visibility.
 * @returns {string|null} return.gemsModalMode - Current mode for GEM modal ('deposit', 'withdraw', etc).
 * @returns {string|null} return.wethModalMode - Current mode for WETH modal.
 * @returns {Function} return.handleOpenGemsModal - Opens GEM modal and sets its mode.
 * @returns {Function} return.handleOpenWethModal - Opens WETH modal and sets its mode.
 * @returns {Object} return.filters - Current filter values for rarity and element.
 * @returns {Function} return.handleFilterChange - Updates filter state.
 * @returns {Array} return.statistics - Stats object array for display: Guardians, Active Players, Battles disputed.
 * @returns {number} return.omnoGEMsBalance - Current balance of GEMs in Omno.
 * @returns {number} return.omnoWethBalance - Current balance of WETH in Omno.
 * @returns {Array} return.filteredCards - Cards after applying current filters.
 * @returns {Function} return.parseWETH - Parser function for formatting WETH values.
 * @returns {number} return.IGNISBalance - User's IGNIS token balance.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const useBattlegroundState = infoAccount => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { accountRs, IGNISBalance } = infoAccount;

    const [modals, setModals] = useState({
        inventory: false,
        battle: false,
        battleRecord: false,
        leaderboards: false,
        earnings: false,
        quickStart: false,
        newPlayers: false,
        advert: false,
        items: false,
    });

    const [isScrollLocked, setIsScrollLocked] = useState(false);
    const [updateState, setUpdateState] = useState(false);
    const [selectedArena, setSelectedArena] = useState('');
    const [currentBlock, setCurrentBlock] = useState(null);
    const [filters, setFilters] = useState({ rarity: -1, element: -1, defender: '' });

    const { isOpen: isOpenGems, onOpen: onOpenGems, onClose: onCloseGems } = useDisclosure();
    const { isOpen: isOpenWeth, onOpen: onOpenWeth, onClose: onCloseWeth } = useDisclosure();

    const [gemsModalMode, setGemsModalMode] = useState(null);
    const [wethModalMode, setWethModalMode] = useState(null);

    const [hasSeenNewPlayersModal, setHasSeenNewPlayersModal] = useState(false);
    const {
        battleCount,
        activePlayers,
        landLords,
        omnoGEMsBalance,
        omnoWethBalance,
        filteredCards,
        parseWETH,
        loading,
    } = useSelector(state => state.battlegrounds);
    const { cards } = useSelector(state => state.cards);
    const { prev_height } = useSelector(state => state.blockchain);

    useEffect(() => {
        if (isNotLogged(infoAccount)) navigate('/login');
    }, [infoAccount, navigate]);

    useEffect(() => {
        if (!hasSeenNewPlayersModal && !loading) {
            if (!filteredCards || filteredCards.length === 0) {
                setModals(prev => ({ ...prev, newPlayers: true }));
            } else {
                setHasSeenNewPlayersModal(true);
            }
        }
    }, [filteredCards, loading, hasSeenNewPlayersModal]);

    useEffect(() => {
        if (cards && accountRs) {
            dispatch(fetchBattleData({ accountRs, cards }));
        }
    }, [dispatch, accountRs, cards, updateState]);

    const updateBattlegroundStatus = useCallback(() => {
        if (!currentBlock || currentBlock !== prev_height) {
            setCurrentBlock(prev_height);
            setUpdateState(prev => !prev);
            cleanStuckedBattleCards(prev_height);

            Promise.all([
                dispatch(fetchItems({ accountRs })),
                dispatch(fetchArenasInfo()),
                dispatch(fetchSoldiers()),
                accountRs && dispatch(fetchUserBattles(accountRs)),
                dispatch(fetchLeaderboards()),
                cards && accountRs && dispatch(fetchBattleData({ accountRs, cards })),
                updateFilteredCards(accountRs, cards, dispatch),
            ]);
        }
    }, [currentBlock, prev_height, dispatch, accountRs, cards]);

    useEffect(() => {
        if (prev_height) updateBattlegroundStatus();
    }, [prev_height, updateBattlegroundStatus]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            dispatch(getBlockchainBlocks());
        }, REFRESH_BLOCK_TIME);
        return () => clearInterval(intervalId);
    }, [dispatch]);

    const handleOpenModal = key => {
        setModals(prev => ({ ...prev, [key]: true }));
        setIsScrollLocked(true);
    };

    const handleCloseModal = key => {
        setModals(prev => ({ ...prev, [key]: false }));
        setIsScrollLocked(false);
        setUpdateState(prev => !prev);
    };

    const handleOpenGemsModal = mode => {
        setGemsModalMode(mode);
        onOpenGems();
    };

    const handleOpenWethModal = mode => {
        setWethModalMode(mode);
        onOpenWeth();
    };

    const handleFilterChange = (type, value) => {
        let formattedValue;
        if (type === 'defender') formattedValue = value;
        else formattedValue = Number(value);
        setFilters(prev => ({ ...prev, [type]: formattedValue }));
    };

    const handleResetFilters = () => {
        setFilters({ rarity: -1, element: -1, defender: '' });
    };

    const statistics = useMemo(
        () => [
            { name: 'Guardians', value: landLords },
            { name: 'Active players', value: activePlayers },
            { name: 'Battles disputed', value: battleCount },
        ],
        [landLords, activePlayers, battleCount]
    );

    return {
        modals,
        isScrollLocked,
        selectedArena,
        setSelectedArena,
        handleOpenModal,
        handleCloseModal,
        onOpenGems,
        onOpenWeth,
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
        filteredCards,
        parseWETH,
        IGNISBalance,
        setHasSeenNewPlayersModal,
    };
};
