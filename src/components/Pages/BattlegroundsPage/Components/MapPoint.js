import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Image,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Portal,
    Square,
    Stack,
    Text,
    Tooltip,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import { addressToAccountId, getAccount } from '../../../../services/Ardor/ardorInterface';
import { copyToast } from '../../../../utils/alerts';
import {
    formatAddress,
    getContinentIcon,
    getLevelIconInt,
    getLevelIconString,
    getMediumIcon,
    getMediumIconInt,
    getTimeDifference,
} from '../Utils/BattlegroundsUtils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSoldiers } from '../../../../redux/reducers/SoldiersReducer';

export const MapPoint = React.memo(
    ({ handleClick, arena, selectedArena, cards, handleStartBattle, infoAccount, openPopoverId, setOpenPopoverId }) => {
        const dispatch = useDispatch();
        const { soldiers } = useSelector(state => state.soldiers);

        const [defenderInfo, setDefenderInfo] = useState(null);
        const [defenderCards, setDefenderCards] = useState(null);
        const [myArena, setMyArena] = useState(false);
        const [medium, setMedium] = useState('Unknown');

        const { isOpen, onClose, onOpen } = useDisclosure();

        const { id, x, y, name } = arena;
        const toast = useToast();

        const copyToClipboard = useCallback(
            address => {
                navigator.clipboard.writeText(address);
                copyToast('ARDOR address', toast);
            },
            [toast]
        );

        useEffect(() => {
            const getDefenderInfo = async () => {
                const accountId = addressToAccountId(infoAccount.accountRs);
                const res = await getAccount(arena.defender.account);
                setDefenderInfo(res);
                const defenderAssets = new Set(arena.defender.asset);
                const matchingObjects = cards.filter(obj => defenderAssets.has(obj.asset));
                setDefenderCards(matchingObjects);
                if (arena.defender.account === accountId) {
                    setMyArena(true);
                }
            };
            getDefenderInfo();
        }, [arena.defender.account, arena.defender.asset, cards, infoAccount.accountRs]);

        useEffect(() => {
            if (openPopoverId === id) {
                onOpen();
            } else {
                onClose();
            }
        }, [openPopoverId, id, onOpen, onClose]);

        const handlePopoverClick = () => {
            if (isOpen) {
                onClose();
                setOpenPopoverId(null);
            } else {
                setOpenPopoverId(id);
                onOpen();
            }
        };

        const handleClose = useCallback(() => {
            setOpenPopoverId(null);
            onClose();
        }, [onClose, setOpenPopoverId]);

        const clickButton = useCallback(() => {
            handleClose();
            handleClick(id);
            handleStartBattle();
        }, [handleClick, handleClose, handleStartBattle, id]);

        useEffect(() => {
            dispatch(fetchSoldiers());
        }, [dispatch]);

        useEffect(() => {
            switch (arena.mediumId) {
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
        }, [arena.mediumId]);

        return (
            arena &&
            defenderInfo && (
                <>
                    <Popover
                        isOpen={isOpen}
                        onClose={handleClose}
                        closeOnBlur={true}
                        motionPreset="scale"
                        placement="right"
                        modifiers={[
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, -20],
                                },
                            },
                        ]}>
                        <PopoverTrigger>
                            <g>
                                {isOpen && (
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r={30}
                                        fill="rgba(127, 192, 190, 0.3)"
                                        stroke="#7FC0BE"
                                        strokeWidth={2}
                                    />
                                )}
                                <circle
                                    onClick={handlePopoverClick}
                                    cx={x}
                                    cy={y}
                                    r={7}
                                    fill={myArena ? 'red' : selectedArena !== id ? '#0056F5' : '#7FC0BE'}
                                    stroke="white"
                                    className="circle-btn"
                                    strokeWidth={1.5}
                                />
                            </g>
                        </PopoverTrigger>
                        {isOpen && (
                            <Portal>
                                <PopoverContent backgroundColor={'#5A679B'} border={'none'}>
                                    <PopoverArrow backgroundColor={'#202323'} />
                                    <PopoverHeader
                                        fontFamily={'Chelsea Market, system-ui'}
                                        bgColor={'#202323'}
                                        borderTopRadius={'inherit'}
                                        textAlign={'center'}
                                        display={'flex'}
                                        flexDirection={'column'}
                                        alignItems={'center'}>
                                        <Stack
                                            direction={'row'}
                                            mx={'auto'}
                                            p={2}
                                            w={'90%'}
                                            justifyContent={'space-between'}>
                                            <Image
                                                src={getLevelIconString(arena.rarity)}
                                                w={'10%'}
                                                bgColor={'#FFF'}
                                                borderRadius={'full'}
                                            />
                                            <Text textTransform={'uppercase'} color={'#EBB2B9'} fontSize={'large'}>
                                                {name}
                                            </Text>
                                            <Image src={getMediumIcon(medium)} w={'10%'} />
                                        </Stack>
                                        <Tooltip label={`Copy: ${defenderInfo.accountRS}`} hasArrow placement="right">
                                            <Text
                                                textTransform={'uppercase'}
                                                color={'#FFF'}
                                                onClick={() => copyToClipboard(defenderInfo.accountRS)}>
                                                GUARDIAN: {defenderInfo.name || formatAddress(defenderInfo.accountRS)}{' '}
                                            </Text>
                                        </Tooltip>
                                    </PopoverHeader>
                                    <PopoverCloseButton onClick={handleClose} />
                                    <PopoverBody
                                        fontFamily={'Chelsea Market, system-ui'}
                                        display={'flex'}
                                        justifyContent={'center'}
                                        flexDir={'column'}
                                        gap={5}
                                        bgColor={'#5A679B'}
                                        mx={'auto'}>
                                        <Stack direction={'column'} mt={0} mx={'auto'} w={'80%'}>
                                            {defenderCards.map((card, index) => {
                                                let cardSoldier = soldiers.soldier.find(
                                                    soldier => soldier.asset === card.asset
                                                );
                                                return (
                                                    <Stack direction={'row'} key={index} my={1}>
                                                        <Image
                                                            aspectRatio={1}
                                                            borderRadius={'10px'}
                                                            w={'60px'}
                                                            key={card.asset}
                                                            src={card.cardThumbUrl}
                                                            border={'3px solid #FFF'}
                                                        />
                                                        <Stack direction={'column'} ml={2}>
                                                            <Text
                                                                color={'#FFF'}
                                                                textTransform={'capitalize'}
                                                                fontFamily={'Inter, system-ui'}
                                                                fontWeight={'700'}
                                                                fontSize={'md'}>
                                                                {card.name}
                                                            </Text>
                                                            <Stack
                                                                direction={'row'}
                                                                w={'80%'}
                                                                justifyContent={'space-between'}>
                                                                <Image
                                                                    src={getContinentIcon(card.channel)}
                                                                    w={'20%'}
                                                                    maxH={'30px'}
                                                                    p={0.5}
                                                                    borderRadius={'3px'}
                                                                    bgColor={'#FFF'}
                                                                />
                                                                <Image
                                                                    src={getMediumIconInt(cardSoldier.mediumId)}
                                                                    w={'20%'}
                                                                />
                                                                <Square w={'20%'}>
                                                                    <Image
                                                                        src={getLevelIconInt(cardSoldier.power)}
                                                                        borderRadius={'full'}
                                                                        bgColor={'#FFF'}
                                                                    />
                                                                </Square>
                                                            </Stack>
                                                        </Stack>
                                                    </Stack>
                                                );
                                            })}
                                        </Stack>
                                    </PopoverBody>
                                    <PopoverFooter
                                        bgColor={'#202323'}
                                        borderBottomRadius={'inherit'}
                                        p={5}
                                        textAlign={'center'}>
                                        <Tooltip
                                            hasArrow
                                            label={myArena ? `You can't fight against yourself` : null}
                                            placement="right">
                                            <Box
                                                mx="auto"
                                                borderRadius="30px"
                                                p="3px"
                                                background="linear-gradient(49deg, rgba(235,178,185,1) 0%, rgba(32,36,36,1) 100%)"
                                                display="inline-block">
                                                <Button
                                                    color={'#FFF'}
                                                    isDisabled={myArena}
                                                    sx={{
                                                        _hover: myArena
                                                            ? { backgroundColor: '#484848' }
                                                            : { backgroundColor: 'whiteAlpha.100' },
                                                        background:
                                                            'linear-gradient(224.72deg, #5A679B 12.32%, #5A679B 87.76%)',
                                                        borderRadius: '30px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px',
                                                        padding: '3',
                                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                                    }}
                                                    fontFamily={'Chelsea market'}
                                                    fontWeight={400}
                                                    onClick={clickButton}>
                                                    START A BATTLE
                                                </Button>
                                            </Box>
                                        </Tooltip>
                                        {arena.conquestEconomicCluster.timestamp &&
                                        arena.conquestEconomicCluster.timestamp !== 0 ? (
                                            <Text mt={4} fontSize={'sm'}>
                                                Last conquered:{' '}
                                                <span
                                                    style={{
                                                        fontWeight: 'bold',
                                                    }}>
                                                    {getTimeDifference(arena.conquestEconomicCluster.timestamp, false)}{' '}
                                                </span>
                                                ago
                                            </Text>
                                        ) : null}
                                    </PopoverFooter>
                                </PopoverContent>
                            </Portal>
                        )}
                    </Popover>
                </>
            )
        );
    }
);

export default MapPoint;
