import { Box, Heading, IconButton, Stack, Text, Select } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import {CloseIcon } from '@chakra-ui/icons';
import OmnoCards from './OmnoCards';
import GridCards from '../../../../Cards/GridCards';
import { addressToAccountId } from '../../../../../services/Ardor/ardorInterface';
import { getUsersState } from '../../../../../services/Ardor/omnoInterface';
import '@fontsource/chelsea-market';
import ArdorCards from './ArdorCards';
import '../../BattlegroundMap.css';
const Inventory = ({ infoAccount, cards, handleCloseInventory }) => {
    const { accountRs } = infoAccount;
    // const [userInfo, setUserInfo] = useState();
    const [filteredCards, setFilteredCards] = useState([]);

    const [selectedOption, setSelectedOption] = useState('battlegrounds');

    const handleSelectChange = event => {
        setSelectedOption(event.target.value);
    };

    const closeInvetory = () => {
        handleCloseInventory();
    };
    console.log('CARDS: ', cards);

    useEffect(() => {
        const filterCards = async () => {
            const userInfo = await getUserState();
            const assetIds = Object.keys(userInfo.balance.asset);
            const matchingCards = cards.filter(card => assetIds.includes(card.asset));
            console.log(matchingCards);
            setFilteredCards(matchingCards);
        };
        filterCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cards, infoAccount]);

    const getUserState = async () => {
        const accountId = addressToAccountId(accountRs);
        console.log("🚀 ~ getUserState ~ accountId:", accountId)
        let res = await getUsersState().then(res => {
            console.log('GetUSerState Response: ', res);
            return res.data.find(item => item.id === accountId);
        });
        return res;
    };

    return (
        <>
            <Overlay isVisible={true} handleClose={handleCloseInventory} />

            <Box
                pos={'absolute'}
                top={'20px'}
                bgColor={'#1F2323'}
                zIndex={99}
                w={'80%'}
                p={4}
                display={'flex'}
                flexDir={'column'}
                maxH={'850px'}
                borderRadius={'25px'}>
                <IconButton
                    background={'transparent'}
                    color={'#FFF'}
                    icon={<CloseIcon />}
                    _hover={{ background: 'transparent' }}
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={() => closeInvetory()}
                />
                <Select
                    position="absolute"
                    top={8}
                    left={8}
                    w={'fit-content'}
                    bg={'#FFF'}
                    fontFamily={'Chelsea Market, System'}
                    fontWeight={100}
                    value={selectedOption}
                    onChange={handleSelectChange}>
                    <option value="battlegrounds">Battlegrounds</option>
                    <option value="ardor">Ardor</option>
                </Select>
                {selectedOption === 'battlegrounds' && (
                    <OmnoPage filteredCards={filteredCards} infoAccount={infoAccount} cards={cards} />
                )}
                {selectedOption === 'ardor' && (
                    <ArdorPage filteredCards={filteredCards} infoAccount={infoAccount} cards={cards} />
                )}
            </Box>
        </>
    );
};

const OmnoPage = ({ filteredCards, infoAccount, cards }) => {
    return (
        <>
            <Stack direction={'column'} color={'#FFF'} mb={5} mx={'auto'} textAlign={'center'}>
                <Heading fontFamily={'Chelsea Market, System'} fontWeight={100}>
                    INVERTORY
                </Heading>
                <Text>In order to play you will have to import your cards to battlegrounds</Text>
            </Stack>
            <Stack direction={'row'} padding={5}>
                <Box
                    mb={2}
                    backgroundColor={'#0F0F0F'}
                    borderRadius={'20px'}
                    p={4}
                    overflowY={'scroll'}
                    className="custom-scrollbar">
                    <GridCards cards={filteredCards} infoAccount={infoAccount} isOnlyBuy={false} rgbColor="0, 0, 0" />
                </Box>
                <Box maxW={'40%'} backgroundColor={'#0F0F0F'} borderRadius={'20px'} p={4}>
                    <OmnoCards infoAccount={infoAccount} cards={cards} />
                </Box>
            </Stack>
        </>
    );
};

const ArdorPage = ({ cards, filteredCards, infoAccount }) => {
    const userCards = cards.filter(card => card.unconfirmedQuantityQNT >= 1);

    return (
        <>
            <Stack direction={'column'} color={'#FFF'} mb={5} mx={'auto'} textAlign={'center'}>
                <Heading fontFamily={'Chelsea Market, System'} fontWeight={100}>
                    INVERTORY
                </Heading>
                <Text>Here you can withdraw your cards from the army to your Ardor Wallet</Text>
            </Stack>
            <Stack direction={'row'} padding={5} height={'700px'}>
                <Box
                    mb={2}
                    backgroundColor={'#0F0F0F'}
                    borderRadius={'20px'}
                    p={4}
                    overflowY={'scroll'}
                    className="custom-scrollbar">
                    <GridCards cards={userCards} infoAccount={infoAccount} rgbColor="0, 0, 0" />
                </Box>
                <Box maxW={'40%'} backgroundColor={'#0F0F0F'} borderRadius={'20px'} p={4}>
                    <ArdorCards infoAccount={infoAccount} cards={filteredCards} />
                </Box>
            </Stack>
        </>
    );
};

export default Inventory;
