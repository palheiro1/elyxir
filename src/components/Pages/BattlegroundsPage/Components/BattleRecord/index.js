import { useCallback, useEffect, useState } from 'react';
import { Overlay } from '../../../../ui/Overlay';
import { Box, Heading, IconButton, Stack } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import BattleDetails from './BattleDetails';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBattles } from '../../../../../redux/reducers/BattleReducer';
import BattleListTable from './BattleListTable';
import { getAsset } from '../../../../../utils/cardsUtils';
import { isEmptyObject } from '../../../../../utils/utils';

/**
 * @name BattleList
 * @description Container for user battle history, fetching data, computing rewards, and managing battle detail views.
 * @param {Function} handleClose - Function to close the overlay.
 * @param {Object} infoAccount - User account information.
 * @param {Array<Object>} cards - List of user's cards.
 * @param {boolean} isMobile - Flag indicating mobile view.
 * @returns {JSX.Element} Battle list overlay with detail panel.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleRecord = ({ handleClose, infoAccount, cards, isMobile }) => {
    const { accountRs } = infoAccount;
    const dispatch = useDispatch();

    const { arenasInfo, userBattles } = useSelector(state => state.battle);
    const [viewDetails, setViewDetails] = useState(false);
    const [selectedBattle, setSelectedBattle] = useState(null);
    const [selectedArena, setSelectedArena] = useState(null);
    const [battleRewards, setBattleRewards] = useState({});

    useEffect(() => {
        if (accountRs) dispatch(fetchUserBattles(accountRs));
    }, [accountRs, dispatch]);

    const getBattleReward = useCallback(async (arenaInfo, battle) => {
        try {
            const rewardFraction = battle.isWinnerLowerPower ? 0.9 : 0.8;
            if (!isEmptyObject(arenaInfo.battleCost)) {
                const assets = Object.entries(arenaInfo.battleCost.asset);
                const results = await Promise.all(
                    assets.map(async ([asset, price]) => {
                        const assetDetails = await getAsset(asset);
                        return { name: assetDetails, price: price * rewardFraction };
                    })
                );
                return results;
            }
        } catch (error) {
            console.error('🚀 ~ getBattleReward ~ error:', error);
        }
    }, []);

    useEffect(() => {
        const fetchBattleRewards = async () => {
            try {
                const rewards = {};
                await Promise.all(
                    userBattles.map(async item => {
                        const arena = arenasInfo.find(arena => arena.id === item.arenaId);
                        if (arena) {
                            const reward = await getBattleReward(arena, item);
                            rewards[item.battleId] = reward;
                        }
                    })
                );
                setBattleRewards(rewards);
            } catch (error) {
                console.error('🚀 ~ fetchBattleRewards ~ error:', error);
            }
        };

        if (userBattles.length && arenasInfo.length) {
            fetchBattleRewards();
        }
    }, [userBattles, arenasInfo, getBattleReward]);

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
                w={isMobile ? '80%' : viewDetails ? '50%' : '70%'}
                h={viewDetails ? '95%' : '90%'}
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
                    />
                )}
            </Box>
        </>
    );
};

export default BattleRecord;
