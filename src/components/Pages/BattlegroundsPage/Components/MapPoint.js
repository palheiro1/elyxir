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
import Card from '../../../Cards/Card';
import { getAccount } from '../../../../services/Ardor/ardorInterface';
export const MapPoint = ({ name, x, y, handleClick, id, arenaInfo, selectedArena, cards }) => {
    const [defenderInfo, setDefenderInfo] = useState(null);
    const [defenderCards, setDefenderCards] = useState(null);
    const clickButton = () => {
        handleClick(id);
        console.log('INFO ARENA', arenaInfo);
        console.log('🚀 ~ MapPoint ~ cards:', cards);
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
                                {arenaInfo.defender.account === '0' ? (
                                    <Text>The territory has no defender</Text>
                                ) : (
                                    <>
                                        <Text>Defender of the land: {defenderInfo.name}</Text>
                                        <Box>
                                            Defender's cards:
                                            <Stack direction={"row"}>
                                                {defenderCards.map(card => (
                                                    <Img w={"50px"} src={card.cardThumbUrl} />
                                                ))}
                                            </Stack>
                                            {/* Llamar al componente para renderizar una card */}
                                        </Box>
                                    </>
                                )}

                                <ButtonGroup mx={'auto'}>
                                    <Button
                                        backgroundColor={'#484848'}
                                        border={'2px solid #D597B2'}
                                        borderRadius={'30px'}
                                        color={'#FFF'}
                                        onClick={clickButton}>
                                        Yes
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
