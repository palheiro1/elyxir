import { Box, Button, Center, HStack, Img, Spacer, Text, VStack, useDisclosure } from '@chakra-ui/react';
import { Maps } from './Maps';
import { useEffect, useState } from 'react';
import { Popup } from './assets/Popup';
import { ScrollLock } from './assets/ScrollLock';
import logo from './assets/image.png';
import './BattlegroundMap.css';
import { AdvertModal } from './assets/AdvertModal';

const Battlegrounds = () => {
    /* Intro pop up managing */
    const [visible, setVisible] = useState(true);
    const [page, setPage] = useState(1);
    const [isScrollLocked, setIsScrollLocked] = useState(true);
    const [selectedArena, setSelectedArena] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleNext = () => {
        setPage(2);
    };

    const handleClose = () => {
        setVisible(false);
        setIsScrollLocked(false);
    };

    /* Buttons menu list */
    const buttons = [
        { name: 'Scoreboard' },
        { name: 'Elixir' },
        { name: 'Earnings' },
        { name: 'Battle record' },
        { name: 'FAQ' },
    ];

    const statistics = [
        { name: 'Active player', value: 3 },
        { name: 'Battles disputed', value: 24 },
        { name: 'GEM Rewards', value: '245k' },
        { name: 'General ranking', value: 7 },
        { name: 'Time remaining', value: '14 weeks' },
    ];

    const handleStartBattle = () => {
        if (selectedArena) {
            console.log("SELECTED", selectedArena);
        } else { 
            setIsModalOpen(true);
        }
    };

    const handleSelectArena = (id) => {
        setSelectedArena(id)
    }
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Box>
            <Popup visible={visible} page={page} handleClose={handleClose} handleNext={handleNext} />
            <AdvertModal isOpen={isModalOpen} onClose={closeModal} />
            <ScrollLock isLocked={isScrollLocked} />
            <Box position={'absolute'} ml={6} mt={5}>
                <Img src={logo} color={'#FFF'} />
                <Box mt={4} padding={'30px'}>
                    {buttons.map(btn => (
                        <Box className="btn-menu" m={5} key={btn.i}>
                            {btn.name}
                        </Box>
                    ))}
                </Box>
                <HStack>
                    <HStack
                        mt={'250px'}
                        backgroundColor={'#484848'}
                        border={'2px solid #D597B2'}
                        ml={'100px'}
                        borderRadius={'30px'}
                        w={'1000px'}
                        fontFamily={'Chelsea Market, system-ui'}>
                        {statistics.map(item => (
                            <HStack m={3} key={item.i}>
                                <Text color={'#FFF'}>{item.name}:</Text>
                                <Text color={'#D597B2'}>{item.value}</Text>
                            </HStack>
                        ))}
                    </HStack>
                    <Button
                        mt={'250px'}
                        style={{
                            background: 'linear-gradient(224.72deg, #5A679B 12.32%, #5A679B 87.76%)',
                            border: '3px solid #EBB2B9',
                        }}
                        padding={5}
                        textTransform={'uppercase'}
                        color={'#FFF'}
                        fontWeight={'100'}
                        borderRadius={'40px'}
                        fontFamily={'Chelsea Market, system-ui'}
                        onClick={handleStartBattle}>
                        Start battle
                    </Button>
                </HStack>
            </Box>
            <Center >
                <Maps handleSelectArena={handleSelectArena}/>
            </Center>
        </Box>
    );
};

export default Battlegrounds;
