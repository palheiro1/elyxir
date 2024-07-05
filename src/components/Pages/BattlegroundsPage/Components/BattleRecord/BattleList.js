import React, { useEffect, useState } from 'react';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import { Box, Heading, IconButton, Spinner, Stack } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { addressToAccountId, getAccount } from '../../../../../services/Ardor/ardorInterface';
import { getArenas, getUserBattles } from '../../../../../services/Battlegrounds/Battlegrounds';
import locations from '../../assets/LocationsEnum';
import BattleDetails from './BattleDetails';
import BattleListTable from './BattleListTable';
import { formatDate } from '../../Utils/BattlegroundsUtils';

const BattleList = ({ handleClose, infoAccount, cards }) => {
    const { accountRs } = infoAccount;

    const [arenasInfo, setArenasInfo] = useState(null);
    const [userBattles, setUserBattles] = useState(null);
    const [battleDetails, setBattleDetails] = useState(null);
    const [viewDetails, setViewDetails] = useState(false);
    const [selectedBattle, setSelectedBattle] = useState(null);
    const [selectedArena, setSelectedArena] = useState(null);

    useEffect(() => {
        const fetchArenasAndUserBattles = async () => {
            const arenas = await getArenas();
            setArenasInfo(arenas.arena);

            const accountId = await addressToAccountId(accountRs);
            let battles = await getUserBattles(accountId);
            battles = battles
                .filter(battle => battle.battleResult !== undefined)
                .map(battle => {
                    if (battle.defenderArmy.account === accountId) {
                        return {
                            ...battle,
                            isUserDefending: true,
                        };
                    }
                    return {
                        ...battle,
                        isUserDefending: false,
                    };
                });

            setUserBattles(battles.reverse());
        };

        accountRs && fetchArenasAndUserBattles();
    }, [accountRs]);

    useEffect(() => {
        const fetchBattleDetails = async () => {
            if (userBattles && arenasInfo) {
                const details = await Promise.all(
                    userBattles.map(async battle => {
                        const arenaInfo = await getArenaInfo(
                            battle.arenaId,
                            battle.defenderArmy.account,
                            battle.attackerArmy.account
                        );
                        return {
                            ...battle,
                            date: formatDate(battle.economicCluster.timestamp),
                            arenaName: arenaInfo.arena.name,
                            defenderDetails: arenaInfo.defender,
                            attackerDetails: arenaInfo.attacker,
                        };
                    })
                );
                setBattleDetails(details);
            }
        };

        fetchBattleDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userBattles, arenasInfo]);

    const getArenaInfo = async (arenaId, defenderAccount, attackerAccount) => {
        if (arenasInfo) {
            let arena = arenasInfo.find(arena => arena.id === arenaId);
            let defender = await getAccount(defenderAccount);
            let attacker = await getAccount(attackerAccount);
            let name = locations.find(item => item.id === arenaId);
            return {
                defender: defender,
                attacker: attacker,
                arena: { ...name, ...arena },
            };
        }
    };

    const handleViewDetails = battleId => {
        setSelectedBattle(battleId);

        let arenaId = battleDetails.find(battle => battle.id === battleId).arenaId;
        let arena = arenasInfo.find(arena => arena.id === arenaId);
        setSelectedArena(arena);
        setViewDetails(true);
    };

    const handleGoBack = () => {
        setSelectedBattle(null);
        setViewDetails(false);
    };

    return (
        <>
            <Overlay isVisible={true} handleClose={handleClose} />
            <Box
                pos={'fixed'}
                bgColor={'#1F2323'}
                zIndex={99}
                w={'70%'}
                h={'90%'}
                borderRadius={'25px'}
                overflowY={'scroll'}
                className="custom-scrollbar"
                top={'50%'}
                left={'50%'}
                transform={'translate(-50%, -50%)'}>
                <IconButton
                    background={'transparent'}
                    color={'#FFF'}
                    icon={<CloseIcon />}
                    _hover={{ background: 'transparent' }}
                    position="absolute"
                    top={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    right={2}
                    zIndex={999}
                    onClick={handleClose}
                />
                {!viewDetails && (
                    <>
                        <Stack direction={'column'} color={'#FFF'} my={5} mx={'auto'} textAlign={'center'} maxH={'90%'}>
                            <Heading fontFamily={'Chelsea Market, System'} fontWeight={100}>
                                BATTLE RECORD
                            </Heading>
                        </Stack>
                        {battleDetails ? (
                            <BattleListTable handleViewDetails={handleViewDetails} battleDetails={battleDetails} />
                        ) : (
                            <Box
                                h={'100%'}
                                position={'absolute'}
                                color={'#FFF'}
                                alignContent={'center'}
                                top={'50%'}
                                left={'50%'}
                                w={'100%'}
                                textAlign={'center'}
                                transform={'translate(-50%, -50%)'}>
                                <Spinner color="#FFF" w={20} h={20} />
                            </Box>
                        )}
                    </>
                )}
                {viewDetails && (
                    <BattleDetails
                        battleId={selectedBattle}
                        cards={cards}
                        arenaInfo={selectedArena}
                        infoAccount={infoAccount}
                        defenderInfo={battleDetails.find(battle => battle.id === selectedBattle).defenderDetails}
                        attackerInfo={battleDetails.find(battle => battle.id === selectedBattle).attackerDetails}
                        isUserDefending={battleDetails.find(battle => battle.id === selectedBattle).isUserDefending}
                        handleGoBack={handleGoBack}
                    />
                )}
            </Box>
        </>
    );
};

export default BattleList;
