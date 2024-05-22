import { Box, Button, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChevronLeftIcon, CloseIcon } from '@chakra-ui/icons';
import { SelectHandPage } from './SelectHandPage';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import GridCards from '../../../../Cards/GridCards';

export const BattleWindow = ({ arenaInfo, handleCloseBattle, infoAccount, cards, filteredCards }) => {
    const [openIventory, setOpenIventory] = useState(false);

    const [index, setIndex] = useState('');

    const handleOpenInventory = index => {
        console.log('Index clicked:', index);
        setIndex(index);
        setOpenIventory(true);
    };

    const handleClose = () => {
        handleCloseBattle();
    };

    const [handBattleCards, setHandBattleCards] = useState(['', '', '', '', '']);

    const updateCard = newValue => {
        setHandBattleCards(prevCards => {
            const newCards = [...prevCards];
            newCards[index] = newValue;
            return newCards;
        });
    };
    console.log(handBattleCards);

    return (
        <>
            <Overlay isVisible={true} handleClose={handleClose} />

            <Box
                pos={'fixed'}
                bgColor={'#1F2323'}
                zIndex={99}
                w={'90%'}
                h={'90%'}
                borderRadius={'25px'}
                top={'50%'}
                left={'50%'}
                transform={'translate(-50%, -50%)'}>
                <IconButton
                    background={'transparent'}
                    color={'#FFF'}
                    icon={<CloseIcon />}
                    _hover={{ background: 'transparent' }}
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={handleClose}
                />
                {!openIventory && (
                    <SelectHandPage
                        arenaInfo={arenaInfo}
                        handleOpenInventory={handleOpenInventory}
                        handBattleCards={handBattleCards}
                        openInventory={handleOpenInventory}
                    />
                )}
                {openIventory && (
                    <>
                        <IconButton
                            icon={<ChevronLeftIcon boxSize={8} />}
                            bg={'transparent'}
                            color={'#FFF'}
                            _hover={{ bg: 'transparent' }}
                            onClick={() => setOpenIventory(false)}>
                            Go back
                        </IconButton>
                        <GridCards
                            cards={filteredCards}
                            infoAccount={infoAccount}
                            isOnlyBuy={false}
                            rgbColor="0, 0, 0"
                            textColor="rgb(255,255,255)"
                            isDisabledButtons={true}
                            isBattleInventory={true}
                            updateCard={updateCard}
                            selectedIndex={index}
                        />
                    </>
                )}
            </Box>
        </>
    );
};
