import { Box, Img, Spinner, Stack, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { addressToAccountId } from '../../../../../services/Ardor/ardorInterface';
import { getLastUserBattle, getSoldiers } from '../../../../../services/Battlegrounds/Battlegrounds';
import '@fontsource/chelsea-market';
import locations from '../../assets/LocationsEnum';

const BattleResults = ({ infoAccount, currentTime, cards, arenaInfo, domainName, defenderInfo }) => {
    const [battleInfo, setBattleInfo] = useState(null);
    const [capturedCard, setCapturedCard] = useState(null);
    const [medium, setMedium] = useState();
    const [arenaName, setArenaName] = useState(null);
    const intervalRef = useRef(null);
    const [attackerPoints, setAttackerPoints] = useState(0);
    const [defenderPoints, setDefenderPoints] = useState(0);
    const [attackerBonus, setAttackerBonus] = useState([]);
    const [defenderBonus, setDefenderBonus] = useState([]);
    const [battleResults, setBattleResults] = useState(null);

    const getLastBattle = useCallback(async () => {
        if (currentTime) {
            if (arenaInfo) {
                switch (arenaInfo.mediumId) {
                    case 1:
                        setMedium('Terrestrial');
                        break;
                    case 2:
                        setMedium('Aerial');
                        break;
                    case 3:
                        setMedium('Aquatic');
                        break;
                    default:
                        setMedium('Unknown');
                }
            }

            setArenaName(locations[arenaInfo.id - 1].name);
            const accountId = addressToAccountId(infoAccount.accountRs);
            const res = await getLastUserBattle(accountId, currentTime);
            console.log('🚀 ~ getLastBattle ~ res:', res);
            if (res && res !== 'pending') {
                const capturedCard = cards.filter(obj => Object.keys(res.captured.asset).includes(obj.asset))[0];
                setCapturedCard(capturedCard);

                setBattleResults(res.battleResult);
            }
            setBattleInfo(res);
        }
    }, [currentTime, arenaInfo, infoAccount.accountRs, cards]);

    const calculateBonus = useCallback(
        async card => {
            const bonus = {
                mediumBonus: 0,
                domainBonus: 0,
            };

            const soldiers = await getSoldiers();
            const arenaSoldier = soldiers.soldier.find(item => item.arenaId === arenaInfo.id);
            const cardInfo = soldiers.soldier.find(item => item.asset === card.asset);
            if (cardInfo.mediumId === arenaSoldier.mediumId) {
                bonus.mediumBonus += 1;
            }
            if (cardInfo.domainId === arenaSoldier.domainId) {
                bonus.domainBonus += 1;
            }

            return bonus;
        },
        [arenaInfo.id]
    );
    useEffect(() => {
        if (currentTime) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            intervalRef.current = setInterval(getLastBattle, 5000);

            return () => clearInterval(intervalRef.current);
        }
    }, [currentTime, getLastBattle]);

    useEffect(() => {
        const calculateAllBonusesAndPoints = async () => {
            let pointsA = 0;
            let pointsD = 0;
            const attackerResults = [];
            const defenderResults = [];

            await Promise.all(
                battleResults.map(async item => {
                    const attackerCard = cards.find(card => String(card.asset) === String(item.attackerAsset));
                    const defenderCard = cards.find(card => String(card.asset) === String(item.defenderAsset));

                    if (attackerCard && defenderCard) {
                        const attackerBonuses = (await calculateBonus(attackerCard)) || {
                            mediumBonus: 0,
                            domainBonus: 0,
                        };
                        const defenderBonuses = (await calculateBonus(defenderCard)) || {
                            mediumBonus: 0,
                            domainBonus: 0,
                        };

                        attackerResults.push(attackerBonuses);
                        defenderResults.push(defenderBonuses);

                        pointsA += item.attackerValue;
                        pointsD += item.defenderValue;
                    } else {
                        console.log('Missing card data for attacker or defender', { attackerCard, defenderCard });
                    }
                })
            );

            setAttackerPoints(pointsA);
            setDefenderPoints(pointsD);
            setAttackerBonus(attackerResults);
            setDefenderBonus(defenderResults);
        };

        if (battleResults && cards && calculateBonus) {
            calculateAllBonusesAndPoints();
        }
    }, [battleResults, calculateBonus, cards]);

    return battleInfo ? (
        <Box
            display={'flex'}
            h={'100%'}
            position={'absolute'}
            fontFamily={'Chelsea Market, system-ui'}
            fontSize={'larger'}
            color={'#FFF'}
            alignContent={'center'}
            left={'50%'}
            top={'50%'}
            transform={'translate(-50%, -50%)'}
            className="custom-scrollbar"
            overflowY={'scroll'}
            overflowX={'hidden'}
            w={'100%'}
            textAlign={'center'}>
            {battleInfo === 'pending' ? (
                <Box position={'absolute'} left={'50%'} top={'50%'} transform={'translate(-50%, -50%)'}>
                    Pending result...
                </Box>
            ) : (
                <Stack direction={'column'} h={'20%'} mx={'auto'}>
                    <Stack
                        alignSelf={'center'}
                        fontFamily={'Chelsea Market, system-ui'}
                        direction={'row'}
                        border={'2px solid #D08FB0'}
                        borderRadius={25}
                        p={2}
                        mt={4}
                        w={'90%'}
                        spacing={10}
                        fontSize={'large'}>
                        <Stack direction={'row'} flexGrow={1} ml={6}>
                            <Text color="#D08FB0">TERRITORY: </Text>
                            <Text textTransform={'uppercase'}>
                                {arenaName}, {domainName}
                            </Text>
                        </Stack>
                        <Box flex="1" />
                        <Stack direction={'row'} mr={6}>
                            <Text color="#D08FB0">MEDIUM: </Text>
                            <Text textTransform={'uppercase'}>{medium}</Text>
                        </Stack>
                    </Stack>

                    <Stack direction={'row'} spacing={10} justifyContent={'center'} ml={'3%'}>
                        <Text color={battleInfo.isDefenderWin ? '#E14942' : '#EDBA2B'}>
                            {battleInfo.isDefenderWin ? 'LOSER: ' : 'WINNER: '}{' '}
                            <span style={{ color: '#FFF' }}> {infoAccount.name}</span>
                        </Text>

                        <Stack direction={'row'}>
                            <Box border={'2px solid #7FC0BE'} borderRadius={5} w={8} h={8}>
                                {attackerPoints}
                            </Box>
                            <Text color={'#D597B2'}> TO </Text>
                            <Box border={'2px solid #7FC0BE'} borderRadius={5} w={8} h={8}>
                                {defenderPoints}
                            </Box>
                        </Stack>

                        <Text color={battleInfo.isDefenderWin ? '#EDBA2B' : '#E14942'}>
                            {battleInfo.isDefenderWin ? 'WINNER: ' : 'LOSER: '}{' '}
                            <span style={{ color: '#FFF' }}> {defenderInfo.name || 'Unknown'} </span>
                        </Text>
                    </Stack>
                    <Stack direction={'column'} ml={'30%'} mt={3}>
                        {battleInfo !== 'pending' &&
                            battleResults &&
                            battleResults.map((item, index) => {
                                let attackerCard = cards.find(card => {
                                    return card.asset === String(item.attackerAsset);
                                });

                                let defenderCard = cards.find(card => {
                                    return card.asset === String(item.defenderAsset);
                                });

                                return (
                                    <Stack
                                        direction={'row'}
                                        key={index}
                                        display={'flex'}
                                        alignItems={'center'}
                                        spacing={4}>
                                        <Stack fontSize={'xs'} align={'flex-start'}>
                                            <Text>{attackerCard.name}</Text>
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>DOMAIN:</span>{' '}
                                                {attackerBonus[index]?.domainBonus ?? 0}
                                            </Text>
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>MEDIUM:</span>{' '}
                                                {attackerBonus[index]?.mediumBonus ?? 0}
                                            </Text>
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>DICE:</span> {item.attackerRoll}
                                            </Text>
                                            <Text>Round points: {item.attackerValue}</Text>
                                        </Stack>
                                        <Box
                                            width="8"
                                            height="8"
                                            bg={item.attackerRoll <= item.defenderRoll ? 'transparent' : '#FFF'}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            position="relative"
                                            border="2px solid #D597B2"
                                            borderRadius={5}
                                            transform="rotate(45deg)"
                                            _after={{
                                                content: '""',
                                                display: 'block',
                                                paddingBottom: '100%',
                                            }}>
                                            <Text
                                                color={item.attackerRoll <= item.defenderRoll ? '#D597B2' : '#000'}
                                                fontSize="xl"
                                                transform="rotate(-45deg)"
                                                position="absolute">
                                                {item.attackerRoll}
                                            </Text>
                                        </Box>
                                        <Box position="relative" width="10%">
                                            <Img src={attackerCard.cardImgUrl} width="100%" />
                                            {item.defenderValue >= item.attackerValue && (
                                                <Box
                                                    position="absolute"
                                                    top="0"
                                                    left="0"
                                                    width="100%"
                                                    height="100%"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    bg="rgba(0, 0, 0, 0.3)">
                                                    <Text fontSize="150px" color="black" opacity="0.7">
                                                        X
                                                    </Text>
                                                </Box>
                                            )}
                                        </Box>
                                        <Text> vs </Text>
                                        <Box position="relative" width="10%">
                                            <Img src={defenderCard.cardImgUrl} width="100%" />
                                            {item.defenderValue <= item.attackerValue && (
                                                <Box
                                                    position="absolute"
                                                    top="0"
                                                    left="0"
                                                    width="100%"
                                                    height="100%"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    bg="rgba(0, 0, 0, 0.3)">
                                                    <Text fontSize="150px" color="black" opacity="0.7">
                                                        X
                                                    </Text>
                                                </Box>
                                            )}
                                        </Box>
                                        <Box
                                            width="8"
                                            height="8"
                                            bg={item.attackerRoll >= item.defenderRoll ? 'transparent' : '#FFF'}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            position="relative"
                                            border="2px solid #D597B2"
                                            borderRadius={5}
                                            transform="rotate(45deg)"
                                            _after={{
                                                content: '""',
                                                display: 'block',
                                                paddingBottom: '100%',
                                            }}>
                                            <Text
                                                color={item.attackerRoll >= item.defenderRoll ? '#D597B2' : '#000'}
                                                fontSize="xl"
                                                transform="rotate(-45deg)"
                                                position="absolute">
                                                {item.defenderRoll}
                                            </Text>
                                        </Box>

                                        <Stack fontSize={'xs'} align={'flex-end'}>
                                            <Text>{defenderCard.name}</Text>
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>DOMAIN:</span>{' '}
                                                {defenderBonus[index]?.domainBonus ?? 0}
                                            </Text>
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>MEDIUM:</span>{' '}
                                                {defenderBonus[index]?.mediumBonus ?? 0}
                                            </Text>
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>DICE:</span> {item.defenderRoll}
                                            </Text>
                                            <Text>Round points: {item.defenderValue}</Text>
                                        </Stack>
                                    </Stack>
                                );
                            })}
                    </Stack>

                    {battleInfo.isDefenderWin ? (
                        <Stack direction={'column'} align={'center'}>
                            <Text fontSize={'medium'}>Captured card:</Text>
                            <Img w={'8%'} src={capturedCard.cardImgUrl} mb={3} />
                        </Stack>
                    ) : null}
                </Stack>
            )}
        </Box>
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
    );
};

export default BattleResults;
