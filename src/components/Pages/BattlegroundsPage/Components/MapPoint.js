import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Img,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Portal,
    Stack,
    Text,
    Tooltip,
    useToast,
} from '@chakra-ui/react';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import { addressToAccountId, getAccount } from '../../../../services/Ardor/ardorInterface';
import { copyToast } from '../../../../utils/alerts';
import { formatAddress, getTimeDifference } from '../Utils/BattlegroundsUtils';

export const MapPoint = ({ handleClick, arena, selectedArena, cards, handleStartBattle, infoAccount }) => {
    const [defenderInfo, setDefenderInfo] = useState(null);
    const [defenderCards, setDefenderCards] = useState(null);
    const [myArena, setMyArena] = useState(false);
    const [medium, setMedium] = useState('Unknown');

    const { id, x, y, name } = arena;
    const toast = useToast();

    const clickButton = () => {
        handleClick(id);
        handleStartBattle();
    };

    const copyToClipboard = address => {
        navigator.clipboard.writeText(address);
        copyToast('ARDOR address', toast);
    };

    useEffect(() => {
        const getDefenderInfo = async () => {
            const accountId = addressToAccountId(infoAccount.accountRs);
            await getAccount(arena.defender.account).then(res => {
                if (arena.defender.account === accountId) {
                    setMyArena(true);
                }
                setDefenderInfo(res);
                const defenderAssets = new Set(arena.defender.asset);
                const matchingObjects = cards.filter(obj => defenderAssets.has(obj.asset));
                setDefenderCards(matchingObjects);
            });
        };
        getDefenderInfo();
    }, [arena, cards, infoAccount.accountRs]);

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
    }, [arena]);

    return (
        arena &&
        defenderInfo && (
            <>
                <Popover>
                    <PopoverTrigger>
                        <circle
                            cx={x}
                            cy={y}
                            r={7}
                            fill={myArena ? 'red' : selectedArena !== id ? '#0056F5' : '#7FC0BE'}
                            stroke="white"
                            strokeWidth={1.5}
                        />
                    </PopoverTrigger>
                    <Portal>
                        <PopoverContent backgroundColor={'#EBB2B9'}>
                            <PopoverArrow backgroundColor={'#EBB2B9'} />
                            <PopoverHeader fontFamily={'Chelsea Market, system-ui'}>
                                <Text>Want to conquer {name}? </Text>
                                <Text>Medium: {medium}</Text>
                                <Text>Rarity: {arena.rarity} </Text>
                            </PopoverHeader>
                            <PopoverCloseButton />
                            <PopoverBody
                                fontFamily={'Chelsea Market, system-ui'}
                                display={'flex'}
                                justifyContent={'center'}
                                flexDir={'column'}
                                gap={5}
                                mx={'auto'}>
                                <Stack spacing={4}>
                                    <Tooltip label={`Copy: ${defenderInfo.accountRS}`} hasArrow placement="right">
                                        <Text onClick={() => copyToClipboard(defenderInfo.accountRS)}>
                                            Defender of the land:{' '}
                                            {defenderInfo.name || formatAddress(defenderInfo.accountRS)}
                                        </Text>
                                    </Tooltip>
                                    {arena.conquestEconomicCluster.timestamp &&
                                    arena.conquestEconomicCluster.timestamp !== 0 ? (
                                        <Text mt={0}>
                                            Conquered {getTimeDifference(arena.conquestEconomicCluster.timestamp)} ago.
                                        </Text>
                                    ) : null}
                                    <Box>
                                        Defender's cards:
                                        <Stack direction={'row'} mt={0}>
                                            {defenderCards.map(card => (
                                                <Img w={'50px'} key={card.asset} src={card.cardThumbUrl} />
                                            ))}
                                        </Stack>
                                    </Box>
                                </Stack>

                                <ButtonGroup mx={'auto'}>
                                    <Tooltip
                                        hasArrow
                                        label={myArena ? `You can't fight against yourself` : null}
                                        placement="right">
                                        <Button
                                            backgroundColor={'#484848'}
                                            border={'2px solid #D597B2'}
                                            borderRadius={'30px'}
                                            color={'#FFF'}
                                            isDisabled={myArena}
                                            sx={{
                                                _hover: myArena
                                                    ? { backgroundColor: '#484848' }
                                                    : { backgroundColor: 'whiteAlpha.100' },
                                            }}
                                            onClick={clickButton}>
                                            Start battle
                                        </Button>
                                    </Tooltip>
                                </ButtonGroup>
                            </PopoverBody>
                        </PopoverContent>
                    </Portal>
                </Popover>
            </>
        )
    );
};
