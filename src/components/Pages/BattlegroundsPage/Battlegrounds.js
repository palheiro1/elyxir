import { Box, Button, Img, Stack, Text } from '@chakra-ui/react';
import { Maps } from './Maps';
import { useEffect, useState } from 'react';
import { ScrollLock } from './Components/ScrollLock';
import { BattlegroundsIntro } from './Components/BattlegroundsIntro/BattlegroundsIntro';
import logo from './assets/image.png';
import './BattlegroundMap.css';
import { AdvertModal } from './Components/AdvertModal';
import { BattleWindow } from './Components/BattleWindow/BattleWindow';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import Inventory from './Components/Inventory/Inventory';
import { addressToAccountId } from '../../../services/Ardor/ardorInterface';
import { getUsersState } from '../../../services/Ardor/omnoInterface';

const Battlegrounds = ({ infoAccount, cards }) => {
    /* Intro pop up managing */
    const [visible, setVisible] = useState(true);
    const [page, setPage] = useState(1);
    const [isScrollLocked, setIsScrollLocked] = useState(true);

    const [selectedArena, setSelectedArena] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openBattle, setOpenBattle] = useState(false);
    const [openInventory, setOpenInventory] = useState(false);

    const handleNext = () => {
        setPage(2);
    };

    const handleClose = () => {
        setVisible(false);
        setIsScrollLocked(false);
    };

    /* Buttons menu list */
    const buttons = [
        {
            name: 'Inventory',
            onclick: () => {
                setOpenInventory(true);
                setIsScrollLocked(true);
            },
        },
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
            console.log('SELECTED', selectedArena);
            setOpenBattle(true);
            setIsScrollLocked(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleSelectArena = arena => {
        setSelectedArena(arena);
    };

    const handleCloseInventory = () => {
        setOpenInventory(false);
        setIsScrollLocked(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsScrollLocked(false);
    };

    const handleCloseBattle = () => {
        setOpenBattle(false);
        setIsScrollLocked(false);
    };

    const { accountRs } = infoAccount;
    // const [userInfo, setUserInfo] = useState();
    const [filteredCards, setFilteredCards] = useState([]);
    useEffect(() => {
        const filterCards = async () => {
            const userInfo = await getUserState();
            if (userInfo.balance) {
                const assetIds = Object.keys(userInfo.balance.asset);
                const matchingCards = cards.filter(card => assetIds.includes(card.asset));
                // console.log(matchingCards);
                setFilteredCards(matchingCards);
            }
        };
        filterCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cards, infoAccount]);

    const getUserState = async () => {
        const accountId = addressToAccountId(accountRs);
        console.log('🚀 ~ getUserState ~ accountId:', accountId);
        let res = await getUsersState().then(res => {
            return res.data.find(item => item.id === accountId);
        });
        return res;
    };

    return (
        <>
            <Box className="landscape-only">
                {openBattle && (
                    <BattleWindow
                        arenaInfo={selectedArena}
                        handleCloseBattle={handleCloseBattle}
                        infoAccount={infoAccount}
                        cards={cards}
                        filteredCards={filteredCards}
                    />
                )}
                {openInventory && (
                    <Inventory
                        infoAccount={infoAccount}
                        cards={cards}
                        handleCloseInventory={handleCloseInventory}
                        filteredCards={filteredCards}
                    />
                )}
                <BattlegroundsIntro visible={visible} page={page} handleClose={handleClose} handleNext={handleNext} />
                <AdvertModal isOpen={isModalOpen} onClose={closeModal} />
                <ScrollLock isLocked={isScrollLocked} />
                <Box position={'relative'} ml={6} mt={5}>
                    <Img src={logo} color={'#FFF'} />
                    <Stack direction={'row'}>
                        <Box mt={4} padding={'30px'}>
                            {buttons.map(btn => (
                                <Box className="btn-menu" m={5} key={btn.i} onClick={btn.onclick}>
                                    {btn.name}
                                </Box>
                            ))}
                        </Box>
                        <Maps handleSelectArena={handleSelectArena} />
                    </Stack>
                    <Stack direction={'row'} mt={6}>
                        <Stack
                            direction={'row'}
                            backgroundColor={'#484848'}
                            border={'2px solid #D597B2'}
                            ml={'100px'}
                            borderRadius={'30px'}
                            w={'1000px'}
                            fontFamily={'Chelsea Market, system-ui'}>
                            {statistics.map(item => (
                                <Stack direction={'row'} m={3} key={item.i}>
                                    <Text color={'#FFF'}>{item.name}:</Text>
                                    <Text color={'#D597B2'}>{item.value}</Text>
                                </Stack>
                            ))}
                        </Stack>
                        <Button
                            style={{
                                background: 'linear-gradient(224.72deg, #5A679B 12.32%, #5A679B 87.76%)',
                                border: '3px solid #EBB2B9',
                            }}
                            padding={5}
                            textTransform={'uppercase'}
                            color={'#FFF'}
                            fontWeight={'100'}
                            borderRadius={'40px'}
                            zIndex={5}
                            fontFamily={'Chelsea Market, system-ui'}
                            onClick={handleStartBattle}>
                            Start battle
                        </Button>
                    </Stack>
                </Box>
            </Box>
            <Box className="rotate-device" zIndex={999}>
                <Text>Please rotate your device to landscape mode to view this content.</Text>
            </Box>
        </>
    );
};

export default Battlegrounds;
