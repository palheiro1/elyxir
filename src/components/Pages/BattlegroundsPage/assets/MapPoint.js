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
                            r={7} // Adjust the radius as needed
                            fill="#0056F5" // Adjust the fill color as needed
                            stroke="white"
                            strokeWidth={1.5} /* #0056F5 */
                        />
                    </PopoverTrigger>
                    <Portal>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverHeader>¿Quieres conquistar {name}?</PopoverHeader>
                            <PopoverCloseButton />
                            <PopoverBody
                                display={'flex'}
                                justifyContent={'center'}
                                flexDir={'column'}
                                gap={5}
                                mx={'auto'}>
                                {arenaInfo.defender.account === '0' ? (
                                    <Text>El territorio no tiene defensor</Text>
                                ) : (
                                    <>
                                        <Text>Defensor del territorio: {arenaInfo.defender.account}</Text>
                                        <Box>Cartas del defensor: 
                                            {arenaInfo.defender.asset.map((card) => {<Card card={card}/>})} {/* Llamar al componente para renderizar una card */}
                                        </Box>
                                    </>
                                )}
                    
                                <ButtonGroup>
                                    <Button colorScheme="blue" onClick={clickButton}>
                                        Si
                                    </Button>
                                    <Button colorScheme="red">No</Button>
                                </ButtonGroup>
                            </PopoverBody>
                        </PopoverContent>
                    </Portal>
                </Popover>
            </>
        )
    );
};
