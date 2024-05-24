import { Box, Button, IconButton, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, CloseIcon } from '@chakra-ui/icons';
import { SelectHandPage } from './SelectHandPage';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import GridCards from '../../../../Cards/GridCards';
import { getAccount } from '../../../../../services/Ardor/ardorInterface';
import { getSoldiers } from '../../../../../services/Battlegrounds/Battlegrounds';
import Loader from '../../../../Loader/Loader';
import { errorToast } from '../../../../../utils/alerts';

export const BattleWindow = ({ arenaInfo, handleCloseBattle, infoAccount, cards, filteredCards }) => {
    const [openIventory, setOpenIventory] = useState(false);
    const [index, setIndex] = useState('');
    const [defenderInfo, setDefenderInfo] = useState(null);
    const [handBattleCards, setHandBattleCards] = useState(['', '', '', '', '']);
    const [defenderCards, setDefenderCards] = useState(null);
    const [soldiers, setSoldiers] = useState(null);
    const [mediumBonus, setMediumBonus] = useState(0);
    const [domainBonus, setDomainBonus] = useState(0);
    const [domainName, setDomainName] = useState();

    const toast = useToast();

    const handleOpenInventory = index => {
        console.log('Index clicked:', index);
        setIndex(index);
        setOpenIventory(true);
    };

    useEffect(() => {
        const getDefenderInfo = async () => {
            await getAccount(arenaInfo.defender.account).then(res => {
                setDefenderInfo(res);
                const defenderAssets = new Set(arenaInfo.defender.asset);
                const matchingObjects = cards.filter(obj => defenderAssets.has(obj.asset));
                setDefenderCards(matchingObjects);
            });
            await getSoldiers().then(res => {
                console.log('🚀 ~ getDefenderInfo ~ res:', res); //array.find(item => item.arenaId === arenaId);
                setSoldiers(res);
            });
        };
        getDefenderInfo();
    }, [arenaInfo, cards]);

    useEffect(() => {
        if (soldiers) calculateBonus();
    }, [handBattleCards]);

    console.log('🚀 ~ BattleWindow ~ handBattleCards:', handBattleCards);

    const calculateBonus = () => {
        const arenaSoldier = soldiers.soldier.find(item => item.arenaId === arenaInfo.id);
        if (handBattleCards[index] !== '') {
            console.log('🚀 ~ calculateBonus ~ arenaSoldier:', arenaSoldier);

            const cardInfo = soldiers.soldier.find(item => item.asset === handBattleCards[index].asset);

            console.log('🚀 ~ calculateBonus ~ cardInfo:', cardInfo);
            console.log('🚀 ~ BattleWindow ~ arenaInfo:', arenaInfo);

            if (cardInfo.mediumId === arenaInfo.mediumId) {
                setMediumBonus(mediumBonus + 1);
            }
            if (cardInfo.domainId === arenaSoldier.domainId) {
                setDomainBonus(domainBonus + 1);
            }
        }
        setDomainName(cards.find(card => card.asset === arenaSoldier.asset).channel);

        console.log('🚀 ~ calculateBonus ~ mediumBons:', mediumBonus);
    };

    const handleClose = () => {
        handleCloseBattle();
    };

    const updateCard = newValue => {
        setHandBattleCards(prevCards => {
            const assetExists = prevCards.some(card => card.asset === newValue.asset);
            if (assetExists) {
                errorToast('You cannot send repeated cards to battle', toast);
                return prevCards;
            }
            const newCards = [...prevCards];
            newCards[index] = newValue;
            return newCards;
        });
    };

    const deleteCard = index => {
        setHandBattleCards(prevCards => {
            const newCards = [...prevCards];
            newCards[index] = '';
            return newCards;
        });
    };

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
                {!soldiers && <Loader color={'#FFF'} />}
                {soldiers && (
                    <>
                        {!openIventory && defenderInfo && (
                            <SelectHandPage
                                arenaInfo={arenaInfo}
                                handleOpenInventory={handleOpenInventory}
                                handBattleCards={handBattleCards}
                                openInventory={handleOpenInventory}
                                defenderInfo={defenderInfo}
                                deleteCard={deleteCard}
                                domainBonus={domainBonus}
                                mediumBonus={mediumBonus}
                                domainName={domainName}
                                infoAccount={infoAccount}
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
                    </>
                )}
            </Box>
        </>
    );
};
