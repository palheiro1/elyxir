import React from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Portal,
    Text,
} from '@chakra-ui/react';
import "@fontsource/chelsea-market"; 
import "@fontsource/inter"
import Card from '../../../Cards/Card';
export const MapPoint = ({ name, x, y, handleClick, id, arenaInfo }) => {
    const clickButton = () => {
        handleClick(id);
        console.log('INFO ARENA', arenaInfo);
    };

    return (
        arenaInfo && (
            <>
                <Popover>
                    <PopoverTrigger>
                        <circle
                            cx={x}
                            cy={y}
                            r={7} 
                            fill="#0056F5" 
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
                                        <Text>Defender of the land: {arenaInfo.defender.account}</Text>
                                        <Box>
                                            Defender's letter:
                                            {arenaInfo.defender.asset.map(card => {
                                                <Card card={card} />;
                                            })}{' '}
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
