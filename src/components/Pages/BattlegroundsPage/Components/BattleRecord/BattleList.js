import React, { useEffect, useState } from 'react';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import { Box, Heading, IconButton, Spinner, Stack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { addressToAccountId, getAccount } from '../../../../../services/Ardor/ardorInterface';
import { getArenas, getUserBattles } from '../../../../../services/Battlegrounds/Battlegrounds';
import locations from '../../assets/LocationsEnum';
import BattleDetails from './BattleDetails';

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
            battles = battles.filter(battle => battle.battleResult !== undefined);

            setUserBattles(battles.reverse());
        };

        accountRs && fetchArenasAndUserBattles();
    }, [accountRs]);

    useEffect(() => {
        const fetchBattleDetails = async () => {
            if (userBattles && arenasInfo) {
                const details = await Promise.all(
                    userBattles.map(async battle => {
                        const arenaInfo = await getArenaInfo(battle.arenaId, battle.defenderArmy.account);
                        return {
                            ...battle,
                            date: formatDate(battle.economicCluster.timestamp),
                            arenaName: arenaInfo.arena.name,
                            defenderDetails: arenaInfo.defender,
                        };
                    })
                );
                setBattleDetails(details);
            }
        };

        fetchBattleDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userBattles, arenasInfo]);

    const formatDate = timestamp => {
        const eb = new Date(Date.UTC(2018, 0, 1, 0, 0, 0));
        const battleStamp = new Date(eb.getTime() + timestamp * 1000);

        const hours = battleStamp.getUTCHours().toString().padStart(2, '0');
        const minutes = battleStamp.getUTCMinutes().toString().padStart(2, '0');
        const day = battleStamp.getUTCDate().toString().padStart(2, '0');
        const month = (battleStamp.getUTCMonth() + 1).toString().padStart(2, '0');

        return `${hours}:${minutes} ${day}/${month}`;
    };

    const getArenaInfo = async (arenaId, defenderAccount) => {
        if (arenasInfo) {
            let arena = arenasInfo.find(arena => arena.id === arenaId);
            let defender = await getAccount(defenderAccount);
            let name = locations.find(item => item.id === arenaId);
            return {
                defender: defender,
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
                    toh="100%"
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
                            <Table variant={'unstyled'} textColor={'#FFF'} w={'85%'} mx={'auto'}>
                                <Thead>
                                    <Tr>
                                        <Th
                                            fontFamily={'Chelsea Market, System'}
                                            color={'#FFF'}
                                            fontSize={'lg'}
                                            textAlign={'center'}>
                                            Date
                                        </Th>
                                        <Th
                                            fontFamily={'Chelsea Market, System'}
                                            color={'#FFF'}
                                            fontSize={'lg'}
                                            textAlign={'center'}>
                                            Opponent
                                        </Th>
                                        <Th
                                            fontFamily={'Chelsea Market, System'}
                                            color={'#FFF'}
                                            fontSize={'lg'}
                                            textAlign={'center'}>
                                            Arena
                                        </Th>
                                        <Th
                                            fontFamily={'Chelsea Market, System'}
                                            color={'#FFF'}
                                            fontSize={'lg'}
                                            textAlign={'center'}>
                                            Result
                                        </Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {battleDetails.map((item, index) => {
                                        let bgColor = index % 2 === 0 ? '#DB78AA' : '#D08FB0';
                                        return (
                                            <Tr
                                                key={index}
                                                onClick={() => handleViewDetails(item.id)}
                                                cursor={'pointer'}
                                                _hover={{ backgroundColor: 'whiteAlpha.300' }}>
                                                <Td textAlign={'center'} p={2}>
                                                    <Box
                                                        bgColor={bgColor}
                                                        fontFamily={'Chelsea Market, System'}
                                                        h="100%"
                                                        p={3}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center">
                                                        {item.date}
                                                    </Box>
                                                </Td>
                                                <Td textAlign={'center'} p={2}>
                                                    <Box
                                                        bgColor={bgColor}
                                                        fontFamily={'Chelsea Market, System'}
                                                        p={3}
                                                        h="100%"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center">
                                                        {item.defenderDetails.name || 'Unknown'}
                                                    </Box>
                                                </Td>
                                                <Td textAlign={'center'} p={2}>
                                                    <Box
                                                        bgColor={bgColor}
                                                        p={3}
                                                        fontFamily={'Chelsea Market, System'}
                                                        h="100%"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center">
                                                        {item.arenaName}
                                                    </Box>
                                                </Td>
                                                <Td textAlign={'center'} p={2}>
                                                    <Box
                                                        h="100%"
                                                        display="flex"
                                                        p={3}
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        bgColor={item.isDefenderWin ? '#FF6058' : '#66FA7C'}
                                                        fontFamily={'Chelsea Market, System'}>
                                                        {item.isDefenderWin ? 'LOST' : 'WON'}
                                                    </Box>
                                                </Td>
                                            </Tr>
                                        );
                                    })}
                                </Tbody>
                            </Table>
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
                        handleGoBack={handleGoBack}
                    />
                )}
            </Box>
        </>
    );
};

export default BattleList;
