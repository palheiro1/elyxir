import { Box, Img, Stack, Text, Divider, Tooltip, Spinner } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { addressToAccountId, getAccount } from '../../../../../services/Ardor/ardorInterface';
import {
    getArenas,
    getBattleById,
    getLastUserBattle,
    getSoldiers,
} from '../../../../../services/Battlegrounds/Battlegrounds';
import '@fontsource/chelsea-market';
import locations from '../../assets/LocationsEnum';
import Lottie from 'react-lottie';
import animationData from '../../assets/Animation-1720173159051.json';
import { formatAddress } from '../../Utils/BattlegroundsUtils';

const BattleResults = ({ infoAccount, currentTime, cards, arenaInfo, domainName }) => {
    const [battleInfo, setBattleInfo] = useState(null);
    const [capturedCard, setCapturedCard] = useState(null);
    const [medium, setMedium] = useState();
    const [arenaName, setArenaName] = useState(null);
    const intervalRef = useRef(null);
    const [attackerPoints, setAttackerPoints] = useState(<Spinner />);
    const [defenderPoints, setDefenderPoints] = useState(<Spinner />);
    const [attackerBonus, setAttackerBonus] = useState([]);
    const [defenderBonus, setDefenderBonus] = useState([]);
    const [battleResults, setBattleResults] = useState(null);
    const [isUserDefending, setIsUserDefending] = useState(false);
    const [attackerInfo, setAttackerInfo] = useState(null);
    const [defenderInfo, setDefenderInfo] = useState(null);
    const [attackerHero, setAttackerHero] = useState(null);
    const [defenderHero, setDefenderHero] = useState(null);
    const [soldiers, setSoldiers] = useState(null);

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
            if (res) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
                const capturedCard = cards.filter(obj => Object.keys(res.capturedAsset).includes(obj.asset))[0];

                const battle = await getBattleById(res.battleId);
                const attackerHero = cards.find(card => card.asset === battle.attackerArmy.heroAsset);
                setAttackerHero(attackerHero);

                const defenderHero = cards.find(card => card.asset === battle.defenderArmy.heroAsset);
                setDefenderHero(defenderHero);
                setCapturedCard(capturedCard);

                const soldiers = await getSoldiers();
                setSoldiers(soldiers.soldier);

                if (res.defenderAccount === accountId) {
                    setIsUserDefending(true);
                }
                setBattleResults(battle.battleResult);
                let info = await getArenaInfo(arenaInfo.id, res.defenderAccount, res.attackerAccount);
                setAttackerInfo(info.attacker);
                setDefenderInfo(info.defender);
                setBattleInfo(battle);
            }
        }
    }, [currentTime, arenaInfo, infoAccount.accountRs, cards]);

    const getArenaInfo = async (arenaId, defenderAccount, attackerAccount) => {
        const arenasInfo = await getArenas();
        if (arenasInfo) {
            let arena = arenasInfo.arena.find(arena => arena.id === arenaId);
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

    const calculateBonus = useCallback(
        async (card, isAttacker) => {
            let defenderSoldier = soldiers.find(soldier => soldier.asset === defenderHero.asset);
            let attackerSoldier = soldiers.find(soldier => soldier.asset === attackerHero.asset);
            const hero = isAttacker ? attackerSoldier : defenderSoldier;

            const bonus = {
                mediumBonus: 0,
                domainBonus: 0,
                heroBonus: 0,
            };

            const arenaSoldier = soldiers.find(item => item.arenaId === arenaInfo.id);

            const cardInfo = soldiers.find(item => item.asset === card.asset);
            if (cardInfo.mediumId === arenaSoldier.mediumId) {
                bonus.mediumBonus += 1;
            }
            if (cardInfo.domainId === arenaSoldier.domainId) {
                bonus.domainBonus += 1;
            }
            if (cardInfo.mediumId === hero.mediumId) {
                bonus.heroBonus += 1;
            }
            if (cardInfo.domainId === hero.domainId) {
                bonus.heroBonus += 1;
            }
            return bonus;
        },
        [arenaInfo.id, attackerHero, defenderHero, soldiers]
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
                    let { defenderValue, attackerValue } = item;

                    const attackerCard = cards.find(card => String(card.asset) === String(item.attackerAsset));
                    const defenderCard = cards.find(card => String(card.asset) === String(item.defenderAsset));

                    if (attackerCard && defenderCard) {
                        const attackerBonuses = (await calculateBonus(attackerCard, true)) || {
                            mediumBonus: 0,
                            domainBonus: 0,
                            heroBonus: 0,
                        };
                        const defenderBonuses = (await calculateBonus(defenderCard, false)) || {
                            mediumBonus: 0,
                            domainBonus: 0,
                            heroBonus: 0,
                        };

                        attackerResults.push(attackerBonuses);
                        defenderResults.push(defenderBonuses);

                        pointsA += attackerValue;

                        pointsD += defenderValue;
                    }
                })
            );

            setAttackerPoints(pointsA);
            setDefenderPoints(pointsD);
            setAttackerBonus(attackerResults);
            setDefenderBonus(defenderResults);
        };

        if (battleResults && battleInfo && cards && cards.length > 0 && soldiers && calculateBonus) {
            calculateAllBonusesAndPoints();
        }
    }, [battleInfo, battleResults, calculateBonus, cards, soldiers]);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

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

                <Stack direction={'row'} spacing={10} mx={'auto'} justifyContent={'center'} w={'60%'}>
                    <Text color={battleInfo.isDefenderWin ? '#E14942' : '#EDBA2B'} my={'auto'}>
                        {battleInfo.isDefenderWin ? 'LOSER: ' : 'WINNER: '}{' '}
                        <Tooltip label={attackerInfo.accountRS} hasArrow>
                            <span style={{ color: '#FFF' }}>
                                {' '}
                                {attackerInfo.name || formatAddress(attackerInfo.accountRS)}
                            </span>
                        </Tooltip>
                    </Text>

                    <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
                        <Box
                            border={'2px solid #7FC0BE'}
                            borderRadius={5}
                            w={9}
                            h={9}
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            {attackerPoints}
                        </Box>
                        <Text color={'#D597B2'} mx={2}>
                            TO
                        </Text>
                        <Box
                            border={'2px solid #7FC0BE'}
                            borderRadius={5}
                            w={9}
                            h={9}
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            {defenderPoints}
                        </Box>
                    </Stack>
                    <Stack direction={'column'}>
                        <Text color={battleInfo.isDefenderWin ? '#EDBA2B' : '#E14942'} my={'auto'}>
                            {battleInfo.isDefenderWin ? 'WINNER: ' : 'LOSER: '}{' '}
                            <Tooltip label={defenderInfo.accountRS} hasArrow>
                                <span style={{ color: '#FFF' }}>
                                    {' '}
                                    {defenderInfo.name || formatAddress(defenderInfo.accountRS)}{' '}
                                </span>
                            </Tooltip>
                        </Text>
                    </Stack>
                </Stack>
                <Stack direction={'column'}>
                    {battleResults &&
                        battleResults.map((item, index) => {
                            const {
                                defenderValue,
                                attackerValue,
                                attackerRoll,
                                defenderRoll,
                                defenderAsset,
                                attackerAsset,
                            } = item;

                            let attackerCard = cards.find(card => {
                                return card.asset === String(attackerAsset);
                            });

                            let defenderCard = cards.find(card => {
                                return card.asset === String(defenderAsset);
                            });

                            let defenderSoldier = soldiers.find(soldier => soldier.asset === defenderAsset);
                            let attackerSoldier = soldiers.find(soldier => soldier.asset === attackerAsset);

                            let attackerTotalPower = battleInfo.attacker.find(
                                soldier => soldier.asset === attackerAsset
                            ).power;

                            let defenderTotalPower = battleInfo.defender.find(
                                soldier => soldier.asset === defenderAsset
                            ).power;

                            return (
                                <Box key={index}>
                                    <Stack
                                        direction={'row'}
                                        display={'flex'}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        spacing={4}>
                                        <Stack fontSize={'xs'} align={'flex-start'}>
                                            <Text fontSize={'sm'}>
                                                {attackerCard.name}{' '}
                                                {attackerHero.asset === attackerCard.asset ? '(Hero)' : null}
                                            </Text>
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>CARD POWER:</span>{' '}
                                                {attackerSoldier.power}
                                            </Text>
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>DOMAIN BONUS:</span>{' '}
                                                {attackerBonus[index]?.domainBonus ?? 0}
                                            </Text>
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>MEDIUM BONUS:</span>{' '}
                                                {attackerBonus[index]?.mediumBonus ?? 0}
                                            </Text>
                                            {attackerHero.asset !== attackerCard.asset ? (
                                                <Text>
                                                    <span style={{ color: '#D597B2' }}>HERO BONUS:</span>{' '}
                                                    {attackerBonus[index]?.heroBonus ?? 0}
                                                </Text>
                                            ) : null}
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>TOTAL POWER:</span>{' '}
                                                {attackerTotalPower}
                                            </Text>
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>DICE:</span> {attackerRoll}
                                            </Text>
                                            <Text>Round points: {attackerValue}</Text>
                                        </Stack>
                                        <Box
                                            width="8"
                                            height="8"
                                            bg={attackerRoll <= defenderRoll ? 'transparent' : '#FFF'}
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
                                                color={attackerRoll <= defenderRoll ? '#D597B2' : '#000'}
                                                fontSize="xl"
                                                transform="rotate(-45deg)"
                                                position="absolute">
                                                {attackerRoll}
                                            </Text>
                                        </Box>
                                        <Box
                                            position="relative"
                                            width="11%"
                                            sx={{
                                                border:
                                                    attackerHero.asset === attackerCard.asset
                                                        ? '3px solid #D08FB0'
                                                        : 'none',
                                                borderImage:
                                                    attackerHero.asset === attackerCard.asset
                                                        ? `linear-gradient(90deg, rgba(163,161,81,1) 0%, rgba(219,227,82,1) 35%, rgba(244,135,148,1) 100%) 1`
                                                        : 'none',
                                            }}>
                                            <Img src={attackerCard.cardImgUrl} width="100%" />
                                            {defenderValue >= attackerValue && (
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
                                        <Box
                                            position="relative"
                                            width="11%"
                                            sx={{
                                                border:
                                                    defenderHero.asset === defenderCard.asset
                                                        ? '3px solid #D08FB0'
                                                        : 'none',
                                                borderImage:
                                                    defenderHero.asset === defenderCard.asset
                                                        ? `linear-gradient(90deg, rgba(163,161,81,1) 0%, rgba(219,227,82,1) 35%, rgba(244,135,148,1) 100%) 1`
                                                        : 'none',
                                            }}>
                                            <Img src={defenderCard.cardImgUrl} width="100%" />
                                            {defenderValue <= attackerValue && (
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
                                            bg={attackerRoll >= defenderRoll ? 'transparent' : '#FFF'}
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
                                                color={attackerRoll >= defenderRoll ? '#D597B2' : '#000'}
                                                fontSize="xl"
                                                transform="rotate(-45deg)"
                                                position="absolute">
                                                {defenderRoll}
                                            </Text>
                                        </Box>

                                        <Stack fontSize={'xs'} align={'flex-end'}>
                                            <Text fontSize={'sm'}>
                                                {defenderCard.name}{' '}
                                                {defenderHero.asset === defenderCard.asset ? '(Hero)' : null}{' '}
                                            </Text>
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>CARD POWER: </span>
                                                {defenderSoldier.power}
                                            </Text>
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>DOMAIN BONUS:</span>{' '}
                                                {defenderBonus[index]?.domainBonus ?? 0}
                                            </Text>
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>MEDIUM BONUS:</span>{' '}
                                                {defenderBonus[index]?.mediumBonus ?? 0}
                                            </Text>
                                            {defenderHero.asset !== defenderCard.asset ? (
                                                <Text>
                                                    <span style={{ color: '#D597B2' }}>HERO BONUS:</span>{' '}
                                                    {defenderBonus[index]?.heroBonus ?? 0}
                                                </Text>
                                            ) : null}
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>DEFENDER BONUS:</span> 2
                                            </Text>
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>TOTAL POWER:</span>{' '}
                                                {defenderTotalPower}
                                            </Text>
                                            <Text>
                                                <span style={{ color: '#D597B2' }}>DICE:</span> {defenderRoll}
                                            </Text>
                                            <Text>Round points: {defenderValue}</Text>
                                        </Stack>
                                    </Stack>
                                    <Divider w={'70%'} mx={'auto'} mt={2} />
                                </Box>
                            );
                        })}
                </Stack>

                <Stack direction={'column'} align={'center'}>
                    <Text fontSize={'medium'}>
                        {isUserDefending
                            ? battleInfo.isDefenderWin
                                ? 'Obtained card:'
                                : 'Captured card: '
                            : battleInfo.isDefenderWin
                            ? 'Captured card:'
                            : 'Obtained card: '}
                    </Text>
                    <Img w={'12%'} src={capturedCard.cardImgUrl} mb={5} />
                </Stack>
            </Stack>
        </Box>
    ) : (
        <Box
            position={'absolute'}
            left={'50%'}
            top={'50%'}
            transform={'translate(-50%, -50%)'}
            fontFamily={'Chelsea Market, system-ui'}
            fontSize={'larger'}
            color={'#FFF'}
            textAlign={'center'}>
            <Lottie options={defaultOptions} height={150} width={150} />
            Battle in progress...
            <br></br>Results appear after the next block
        </Box>
    );
};

export default BattleResults;
