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
} from '@chakra-ui/react';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import { getAccount } from '../../../../services/Ardor/ardorInterface';

export const MapPoint = ({ name, x, y, handleClick, id, arenaInfo, selectedArena, cards, handleStartBattle }) => {
    const [defenderInfo, setDefenderInfo] = useState(null);
    const [defenderCards, setDefenderCards] = useState(null);
    const clickButton = () => {
        handleClick(id);
        handleStartBattle();
    };

    useEffect(() => {
        const getDefenderInfo = async () => {
            await getAccount(arenaInfo.defender.account).then(res => {
                setDefenderInfo(res);
                const defenderAssets = new Set(arenaInfo.defender.asset);
                const matchingObjects = cards.filter(obj => defenderAssets.has(obj.asset));
                setDefenderCards(matchingObjects);
            });
        };
        getDefenderInfo();
    }, [arenaInfo, cards]);

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
                            fill={selectedArena !== id ? '#0056F5' : '#7FC0BE'}
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
                                    <Text>Defender of the land: {defenderInfo.name || 'Unknown'}</Text>
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
                                    <Button
                                        backgroundColor={'#484848'}
                                        border={'2px solid #D597B2'}
                                        borderRadius={'30px'}
                                        color={'#FFF'}
                                        onClick={clickButton}>
                                        Start battle
                                    </Button>
                                </ButtonGroup>
                            </PopoverBody>
                        </PopoverContent>
                    </Portal>
                </Popover>
            </>
        )
    );
};
