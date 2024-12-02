import { Box, IconButton, Image, Spinner, Square, Stack, Text, Tooltip, useToast } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState, Fragment } from 'react';
import { getBattleById, getSoldiers } from '../../../../../services/Battlegrounds/Battlegrounds';
import '@fontsource/chelsea-market';
import locations from '../../assets/LocationsEnum';
import { ChevronLeftIcon, ChevronRightIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
    formatAddress,
    getBattleRoundInfo,
    getContinentIcon,
    getDiceIcon,
    getLevelIconInt,
    getMediumIcon,
    getMediumIconInt,
} from '../../Utils/BattlegroundsUtils';
import { errorToast } from '../../../../../utils/alerts';
import defeatIcon from '../../assets/icons/defeat_icon.svg';
import victoryIcon from '../../assets/icons/victory_icon.svg';

const BattleDetails = ({ cards, arenaInfo, handleGoBack, battleDetails, battleId, infoAccount }) => {
    const { attackerDetails: attackerInfo, defenderDetails: defenderInfo, isUserDefending } = battleDetails;
    const [battleInfo, setBattleInfo] = useState(null);
    const [capturedCard, setCapturedCard] = useState(null);
    const [medium, setMedium] = useState();
    const [arenaName, setArenaName] = useState(null);
    const [attackerPoints, setAttackerPoints] = useState(<Spinner />);
    const [defenderPoints, setDefenderPoints] = useState(<Spinner />);
    const [attackerBonus, setAttackerBonus] = useState([]);
    const [defenderBonus, setDefenderBonus] = useState([]);
    const [battleResults, setBattleResults] = useState(null);
    const [domainName, setDomainName] = useState(null);
    const [attackerHero, setAttackerHero] = useState(null);
    const [defenderHero, setDefenderHero] = useState(null);
    const [soldiers, setSoldiers] = useState(null);
    const [arrowDisable, setArrowDisable] = useState(true);
    const [arrowRigthDisable, setArrowRigthDisable] = useState(false);

    const getLastBattle = useCallback(async () => {
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
        const res = await getBattleById(battleId);
        if (res.battleResult === null || !res.battleResult) {
            errorToast("Old version battle. Can not access to it's results.", toast);
            handleGoBack();
        }
        const capturedCard = cards.filter(obj => Object.keys(res.captured.asset).includes(obj.asset))[0];

        const attackerHero = cards.find(card => card.asset === res.attackerArmy.heroAsset);
        setAttackerHero(attackerHero);

        const defenderHero = cards.find(card => card.asset === res.defenderArmy.heroAsset);
        setDefenderHero(defenderHero);
        setCapturedCard(capturedCard);

        const soldiers = await getSoldiers();
        setSoldiers(soldiers.soldier);
        setBattleResults(res);

        setBattleInfo(res);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arenaInfo, battleId, cards]);

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

            setDomainName(cards.find(card => card.asset === arenaSoldier.asset).channel);
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
        [arenaInfo.id, attackerHero, cards, defenderHero, soldiers]
    );

    useEffect(() => {
        battleId && getLastBattle();
    }, [battleId, getLastBattle]);

    useEffect(() => {
        const calculateAllBonusesAndPoints = async () => {
            let pointsA = 0;
            let pointsD = 0;
            const attackerResults = [];
            const defenderResults = [];

            await Promise.all(
                battleResults.battleResult.map(async (item, index) => {
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

                        attackerResults[index] = attackerBonuses;
                        defenderResults[index] = defenderBonuses;

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

        if (battleResults && cards && cards.length > 0 && soldiers && calculateBonus) {
            calculateAllBonusesAndPoints();
        }
    }, [battleDetails.attacker, battleDetails.defender, battleResults, calculateBonus, cards, soldiers]);

    const toast = useToast();
    if (!cards || cards.length <= 0) {
        errorToast('Cards are not loaded. Please refresh the battlegrounds page', toast);
        handleGoBack();
    }

    const elementRef = useRef(null);
    const handleHorizantalScroll = (element, speed, distance, step) => {
        const maxScrollLeft = element.scrollWidth - element.clientWidth;
        let scrollAmount = 0;
        const slideTimer = setInterval(() => {
            element.scrollLeft += step;
            scrollAmount += Math.abs(step);

            if (scrollAmount >= distance) {
                clearInterval(slideTimer);
            }

            if (element.scrollLeft === 0) {
                setArrowDisable(true);
            } else {
                setArrowDisable(false);
            }

            if (element.scrollLeft >= maxScrollLeft) {
                setArrowRigthDisable(true);
            } else {
                setArrowRigthDisable(false);
            }
        }, speed);
    };

    return cards && cards.length > 0 && battleInfo ? (
        <Stack boxSize="100%" height={'105%'}>
            <IconButton
                background={'transparent'}
                color={'#000'}
                icon={<ChevronLeftIcon />}
                _hover={{ background: 'transparent' }}
                position="fixed"
                top={2}
                left={3}
                fontSize="2rem"
                zIndex={999}
                onClick={handleGoBack}
            />
            <Stack
                direction={'row'}
                bgColor={'#BFD1ED'}
                w={'100%'}
                h={'7%'}
                fontFamily={'Chelsea Market, system-ui'}
                borderTopRadius={'25px'}
                justifyContent={'space-between'}
                alignItems={'center'}
                px={4}>
                <Stack direction={'row'}>
                    <Text color={'#000'} my={'auto'} fontSize={'large'} ml={10}>
                        {battleInfo.isDefenderWin ? 'LOSER: ' : 'WINNER: '}
                        <Tooltip label={attackerInfo.accountRS} hasArrow>
                            {attackerInfo.name || formatAddress(attackerInfo.accountRS)}
                        </Tooltip>
                    </Text>
                    <Text
                        color={'#000'}
                        my={'auto'}
                        fontSize={'large'}
                        border={'1px solid #2ba39c'}
                        p={1}
                        borderRadius={'8px'}>
                        {attackerPoints}
                    </Text>
                </Stack>
                <Stack direction={'row'} spacing={3} alignItems={'center'} mr={10}>
                    <Text textTransform={'uppercase'} color={'#000'} mr={5} fontSize={'large'}>
                        {arenaName}
                    </Text>
                    <Image src={getContinentIcon(domainName)} w={'30px'} />
                    <Image src={getMediumIcon(medium)} w={'30px'} />
                    <Image src={getLevelIconInt(arenaInfo.level)} w={'30px'} />
                </Stack>
            </Stack>

            <Stack direction={'row'} mx={'auto'} w={'45%'} justifyContent={'space-between'} mt={2}>
                <Text fontSize={'x-small'} color={'#FFF'} fontFamily={'Inter, system-ui'} my={'auto'}>
                    {infoAccount.accountRs === attackerInfo.accountRS ? 'MY' : 'OPPONENT'} CARDS:
                </Text>
                {battleInfo &&
                    battleInfo.attackerArmy.asset.map((item, index) => {
                        const attackerCard = cards.find(card => card.asset === item);
                        const isOverlayVisible =
                            battleInfo.isDefenderWin ||
                            battleResults.battleResult[battleResults.battleResult.length - 1].attackerAsset !==
                                attackerCard.asset;

                        return (
                            <Box position="relative" m={'auto'} width="12%" key={index}>
                                <Image src={attackerCard.cardImgUrl} width="100%" />
                                {isOverlayVisible && (
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
                                        <Text
                                            fontSize="4rem"
                                            color="#E14942"
                                            opacity="0.8"
                                            fontFamily="'Aagaz', sans-serif">
                                            X
                                        </Text>
                                    </Box>
                                )}
                            </Box>
                        );
                    })}

                <Image src={battleInfo.isDefenderWin ? defeatIcon : victoryIcon} boxSize={'50px'} my={'auto'} />
            </Stack>
            <Stack
                direction={'row'}
                mx={'auto'}
                w={'90%'}
                h={'60%'}
                className="custom-scrollbar"
                overflowX={'scroll'}
                overflowY={'hidden'}
                ref={elementRef}
                spacing={4}>
                <IconButton
                    position="absolute"
                    left="2"
                    icon={<ChevronLeftIcon />}
                    top="50%"
                    color={'black'}
                    isDisabled={arrowDisable}
                    transform="translateY(-50%)"
                    zIndex="1"
                    onClick={() => {
                        handleHorizantalScroll(elementRef.current, 10, 200, -5);
                    }}
                    bg="rgba(255, 255, 255, 0.8)"
                    _hover={{ bg: 'rgba(255, 255, 255, 1)' }}
                    borderRadius={'full'}
                />

                {battleResults &&
                    battleResults.battleResult.map((item, index) => {
                        const {
                            defenderValue,
                            attackerValue,
                            attackerRoll,
                            defenderRoll,
                            defenderAsset,
                            attackerAsset,
                        } = item;
                        const { attackerCard, defenderCard, defenderSoldier, attackerSoldier } = getBattleRoundInfo(
                            defenderAsset,
                            attackerAsset,
                            cards,
                            battleInfo,
                            soldiers
                        );

                        return (
                            <Fragment key={index}>
                                <Stack direction={'column'} minW={'250px'} w={'250px'} h={'100%'} flexShrink={0}>
                                    <Stack direction={'row'} color={'#FFF'} h={'50%'} spacing={4}>
                                        <Stack
                                            direction={'column'}
                                            fontSize={'xs'}
                                            align={'flex-start'}
                                            my={'auto'}
                                            w={'90%'}>
                                            <Text
                                                fontSize={'large'}
                                                letterSpacing={2}
                                                fontFamily="'Aagaz', sans-serif"
                                                color={'#D597B2'}>
                                                {attackerCard.name}{' '}
                                                {attackerHero.asset === attackerCard.asset ? '(Alpha)' : null}
                                            </Text>
                                            <Stack direction={'row'} w={'95%'}>
                                                <Stack direction={'column'} m={'auto'}>
                                                    <Stack direction={'row'}>
                                                        <Image
                                                            boxSize={'20px'}
                                                            borderRadius={'5px'}
                                                            p={0.5}
                                                            bgColor={'#FFF'}
                                                            src={getContinentIcon(attackerCard.channel)}
                                                        />
                                                        <Text>{attackerBonus[index]?.domainBonus ?? 0}</Text>
                                                    </Stack>

                                                    <Stack direction={'row'}>
                                                        <Image
                                                            boxSize={'20px'}
                                                            borderRadius={'5px'}
                                                            p={0.5}
                                                            bgColor={'#FFF'}
                                                            src={getMediumIconInt(attackerSoldier.mediumId)}
                                                        />
                                                        <Text>{attackerBonus[index]?.mediumBonus ?? 0}</Text>
                                                    </Stack>

                                                    <Stack direction={'row'}>
                                                        <Image
                                                            w={'20px'}
                                                            borderRadius={'full'}
                                                            bgColor={'#FFF'}
                                                            src={getLevelIconInt(attackerSoldier.power)}
                                                        />
                                                        <Text>{attackerSoldier.power}</Text>
                                                    </Stack>

                                                    {attackerHero.asset !== attackerCard.asset ? (
                                                        <Stack direction={'row'}>
                                                            <Image
                                                                boxSize={'20px'}
                                                                borderRadius={'5px'}
                                                                bgColor={'#FFF'}
                                                                src={'/images/battlegrounds/alpha_icon.svg'}
                                                            />
                                                            <Text>{attackerBonus[index]?.heroBonus ?? 0}</Text>
                                                        </Stack>
                                                    ) : null}

                                                    <Stack direction={'row'}>
                                                        <Image
                                                            boxSize={'20px'}
                                                            borderRadius={'5px'}
                                                            bgColor={'#FFF'}
                                                            src={getDiceIcon(attackerRoll)}
                                                        />
                                                        <Text>{attackerRoll}</Text>
                                                    </Stack>
                                                </Stack>
                                                <Box
                                                    position="relative"
                                                    m={'auto'}
                                                    width="55%"
                                                    height={'150px'}
                                                    sx={{
                                                        border:
                                                            attackerHero.asset === attackerCard.asset
                                                                ? '3px solid #D08FB0'
                                                                : 'none',
                                                    }}>
                                                    <Box
                                                        display="flex"
                                                        justifyContent="center"
                                                        alignItems="center"
                                                        height="100%">
                                                        <Image
                                                            src={attackerCard.cardImgUrl}
                                                            width={
                                                                attackerHero.asset === attackerCard.asset
                                                                    ? '90%'
                                                                    : '100%'
                                                            }
                                                            m={'auto'}
                                                        />
                                                    </Box>
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
                                                            <Text
                                                                fontSize="9rem"
                                                                color="#E14942"
                                                                opacity="0.8"
                                                                fontFamily="'Aagaz', sans-serif">
                                                                X
                                                            </Text>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Stack>
                                        </Stack>

                                        <Box
                                            right={5}
                                            width="8"
                                            height="8"
                                            bg={attackerValue <= defenderValue ? 'transparent' : '#FFF'}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            position="relative"
                                            m={'auto'}
                                            border="2px solid #D597B2"
                                            borderRadius={5}
                                            transform="rotate(45deg)"
                                            _after={{
                                                content: '""',
                                                display: 'block',
                                                paddingBottom: '100%',
                                            }}>
                                            <Text
                                                fontFamily={'Chelsea Market'}
                                                color={attackerValue <= defenderValue ? '#D597B2' : '#000'}
                                                fontSize="xl"
                                                transform="rotate(-45deg)"
                                                position="absolute">
                                                {attackerValue}
                                            </Text>
                                        </Box>
                                    </Stack>
                                    {/* ======= */}
                                    <Stack direction={'row'} color={'#FFF'} h={'50%'} spacing={4}>
                                        <Stack
                                            direction={'column'}
                                            fontSize={'xs'}
                                            align={'flex-start'}
                                            my={'auto'}
                                            w={'90%'}>
                                            <Text
                                                fontSize={'large'}
                                                letterSpacing={2}
                                                fontFamily="'Aagaz', sans-serif"
                                                color={'#D597B2'}>
                                                {defenderCard.name}{' '}
                                                {defenderHero.asset === defenderCard.asset ? '(Alpha)' : null}
                                            </Text>{' '}
                                            <Stack direction={'row'} w={'95%'}>
                                                <Stack direction={'column'} m={'auto'}>
                                                    <Stack direction={'row'}>
                                                        <Image
                                                            boxSize={'20px'}
                                                            borderRadius={'5px'}
                                                            p={0.5}
                                                            bgColor={'#FFF'}
                                                            src={getContinentIcon(defenderCard.channel)}
                                                        />
                                                        <Text>{defenderBonus[index]?.domainBonus ?? 0}</Text>
                                                    </Stack>

                                                    <Stack direction={'row'}>
                                                        <Image
                                                            boxSize={'20px'}
                                                            borderRadius={'5px'}
                                                            p={0.5}
                                                            bgColor={'#FFF'}
                                                            src={getMediumIconInt(defenderSoldier.mediumId)}
                                                        />
                                                        <Text>{defenderBonus[index]?.mediumBonus ?? 0}</Text>
                                                    </Stack>
                                                    <Stack direction={'row'}>
                                                        <Image
                                                            boxSize={'20px'}
                                                            borderRadius={'full'}
                                                            bgColor={'#FFF'}
                                                            src={getLevelIconInt(defenderSoldier.power)}
                                                        />
                                                        <Text>{defenderSoldier.power}</Text>
                                                    </Stack>

                                                    {defenderHero.asset !== defenderCard.asset ? (
                                                        <Stack direction={'row'}>
                                                            <Image
                                                                boxSize={'20px'}
                                                                borderRadius={'5px'}
                                                                bgColor={'#FFF'}
                                                                src={'/images/battlegrounds/alpha_icon.svg'}
                                                            />
                                                            <Text>{defenderBonus[index]?.heroBonus ?? 0}</Text>
                                                        </Stack>
                                                    ) : null}

                                                    <Stack direction={'row'}>
                                                        <Image
                                                            boxSize={'20px'}
                                                            borderRadius={'5px'}
                                                            bgColor={'#FFF'}
                                                            src={getDiceIcon(defenderRoll)}
                                                        />
                                                        <Text>{defenderRoll}</Text>
                                                    </Stack>
                                                    <Stack direction={'row'}>
                                                        <Image
                                                            boxSize={'20px'}
                                                            borderRadius={'5px'}
                                                            src={'/images/battlegrounds/defense_icon.svg'}
                                                        />
                                                        <Text>{battleInfo.defenderBonus || 2}</Text>
                                                    </Stack>
                                                </Stack>

                                                <Box
                                                    position="relative"
                                                    m={'auto'}
                                                    width="55%"
                                                    height={'150px'}
                                                    sx={{
                                                        border:
                                                            defenderHero.asset === defenderCard.asset
                                                                ? '3px solid #D08FB0'
                                                                : 'none',
                                                    }}>
                                                    <Box
                                                        display="flex"
                                                        justifyContent="center"
                                                        alignItems="center"
                                                        height="100%">
                                                        <Image
                                                            src={defenderCard.cardImgUrl}
                                                            width={
                                                                defenderHero.asset === defenderCard.asset
                                                                    ? '90%'
                                                                    : '100%'
                                                            }
                                                            m={'auto'}
                                                        />
                                                    </Box>
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
                                                            <Text
                                                                fontSize="9rem"
                                                                color="#E14942"
                                                                opacity="0.8"
                                                                fontFamily="'Aagaz', sans-serif">
                                                                X
                                                            </Text>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Stack>
                                        </Stack>
                                        <Box
                                            right={5}
                                            width="8"
                                            height="8"
                                            m={'auto'}
                                            bg={attackerValue >= defenderValue ? 'transparent' : '#FFF'}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            position="relative"
                                            border="2px solid #D597B2"
                                            fontFamily={'Chelsea market'}
                                            borderRadius={5}
                                            transform="rotate(45deg)"
                                            _after={{
                                                content: '""',
                                                display: 'block',
                                                paddingBottom: '100%',
                                            }}>
                                            <Text
                                                color={attackerValue >= defenderValue ? '#D597B2' : '#000'}
                                                fontSize="xl"
                                                transform="rotate(-45deg)"
                                                position="absolute">
                                                {defenderValue}
                                            </Text>
                                        </Box>
                                    </Stack>
                                </Stack>
                                <Square bgColor={'#FFF'} height={'95%'} width={'1px'} my={'auto'} />
                            </Fragment>
                        );
                    })}
                <IconButton
                    position="absolute"
                    right="2"
                    top="50%"
                    icon={<ChevronRightIcon />}
                    bgColor={'transparent'}
                    color={'black'}
                    transform="translateY(-50%)"
                    zIndex="1"
                    isDisabled={arrowRigthDisable}
                    borderRadius={'full'}
                    onClick={() => {
                        handleHorizantalScroll(elementRef.current, 10, 200, 5);
                    }}
                    bg="rgba(255, 255, 255, 0.8)"
                    _hover={{ bg: 'rgba(255, 255, 255, 1)' }}
                />
            </Stack>
            <Stack direction={'row'} mx={'auto'} w={'45%'} justifyContent={'space-between'}>
                <Text fontSize={'x-small'} color={'#FFF'} fontFamily={'Inter, system-ui'} my={'auto'}>
                    {infoAccount.accountRs === defenderInfo.accountRS ? 'MY' : 'OPPONENT'} CARDS:
                </Text>
                {battleInfo &&
                    battleInfo.defenderArmy.asset.map((item, index) => {
                        const defenderCard = cards.find(card => card.asset === item);
                        const isOverlayVisible =
                            !battleInfo.isDefenderWin ||
                            battleResults.battleResult[battleResults.battleResult.length - 1].defenderAsset !==
                                defenderCard.asset;

                        return (
                            <Box position="relative" m={'auto'} width="12%" key={index}>
                                <Image src={defenderCard.cardImgUrl} width="100%" />
                                {isOverlayVisible && (
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
                                        <Text
                                            fontSize="4rem"
                                            color="#E14942"
                                            opacity="0.8"
                                            fontFamily="'Aagaz', sans-serif">
                                            X
                                        </Text>
                                    </Box>
                                )}
                            </Box>
                        );
                    })}
                <Image src={battleInfo.isDefenderWin ? victoryIcon : defeatIcon} boxSize={'50px'} my={'auto'} />
            </Stack>
            <Stack
                direction={'row'}
                bgColor={'#BFD1ED'}
                w={'100%'}
                h={'7%'}
                fontFamily={'Chelsea Market, system-ui'}
                borderBottomRadius={'25px'}
                justifyContent={'space-between'}
                alignItems={'center'}
                px={4}>
                <Stack direction={'row'} w={'100%'}>
                    <Text color={'#000'} my={'auto'} fontSize={'large'} ml={10}>
                        {battleInfo.isDefenderWin ? 'WINNER: ' : 'LOSER: '}
                        <Tooltip label={defenderInfo.accountRS} hasArrow>
                            {defenderInfo.name || formatAddress(defenderInfo.accountRS)}
                        </Tooltip>
                    </Text>
                    <Text
                        color={'#000'}
                        my={'auto'}
                        fontSize={'large'}
                        border={'1px solid #2ba39c'}
                        p={1}
                        borderRadius={'8px'}>
                        {defenderPoints}
                    </Text>
                </Stack>
                <Stack></Stack>
                <Stack direction={'row'} spacing={1} alignItems={'end'} mx={'auto'} w={'30%'} h={'100%'}>
                    <Tooltip
                        label={
                            <Box>
                                <Image src={capturedCard?.cardImgUrl} alt={capturedCard?.name} w="200px" />
                            </Box>
                        }
                        aria-label={capturedCard?.name}
                        placement="top"
                        hasArrow>
                        <Stack direction={'row'} mx={'auto'} my={'auto'}>
                            <Text color={'#000'} fontSize={'large'}>
                                {isUserDefending
                                    ? battleInfo.isDefenderWin
                                        ? 'OBTAINED CARD:'
                                        : 'CAPTURED CARD: '
                                    : battleInfo.isDefenderWin
                                    ? 'CAPTURED CARD:'
                                    : 'OBTAINED CARD: '}
                            </Text>
                            <TriangleUpIcon color={'#000'} my={'auto'} />
                        </Stack>
                    </Tooltip>
                </Stack>
            </Stack>
        </Stack>
    ) : (
        <Box
            h={'100%'}
            position={'absolute'}
            color={'#FFF'}
            alignContent={'center'}
            top={'50%'}
            left={'50%'}
            transform={'translate(-50%, -50%)'}
            w={'100%'}
            textAlign={'center'}>
            <Spinner color="#FFF" w={20} h={20} />
        </Box>
    );
};

export default BattleDetails;
