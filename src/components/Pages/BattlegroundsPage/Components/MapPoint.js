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
} from '@chakra-ui/react';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import { addressToAccountId, getAccount } from '../../../../services/Ardor/ardorInterface';
import { formatAddress } from '../../../../services/Battlegrounds/Battlegrounds';

export const MapPoint = ({
    name,
    x,
    y,
    handleClick,
    id,
    arenaInfo,
    selectedArena,
    cards,
    handleStartBattle,
    infoAccount,
}) => {
    const [defenderInfo, setDefenderInfo] = useState(null);
    console.log('🚀 ~ defenderInfo:', defenderInfo);
    const [defenderCards, setDefenderCards] = useState(null);
    const [myArena, setMyArena] = useState(false);

    const clickButton = () => {
        handleClick(id);
        handleStartBattle();
    };

    useEffect(() => {
        const getDefenderInfo = async () => {
            const accountId = addressToAccountId(infoAccount.accountRs);
            await getAccount(arenaInfo.defender.account).then(res => {
                if (arenaInfo.defender.account === accountId) {
                    setMyArena(true);
                }
                setDefenderInfo(res);
                const defenderAssets = new Set(arenaInfo.defender.asset);
                const matchingObjects = cards.filter(obj => defenderAssets.has(obj.asset));
                setDefenderCards(matchingObjects);
            });
        };
        getDefenderInfo();
    }, [arenaInfo, cards, infoAccount.accountRs]);

    return (
        arenaInfo &&
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
                                Want to conquer {name}?
                            </PopoverHeader>
                            <PopoverCloseButton />
                            <PopoverBody
                                fontFamily={'Chelsea Market, system-ui'}
                                display={'flex'}
                                justifyContent={'center'}
                                flexDir={'column'}
                                gap={5}
                                mx={'auto'}>
                                <>
                                    <Tooltip label={defenderInfo.accountRS} hasArrow placement="right">
                                        <Text>
                                            Defender of the land:{' '}
                                            {defenderInfo.name || formatAddress(defenderInfo.accountRS)}
                                        </Text>
                                    </Tooltip>
                                    <Box>
                                        Defender's cards:
                                        <Stack direction={'row'}>
                                            {defenderCards.map(card => (
                                                <Img w={'50px'} key={card.asset} src={card.cardThumbUrl} />
                                            ))}
                                        </Stack>
                                    </Box>
                                </>

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
