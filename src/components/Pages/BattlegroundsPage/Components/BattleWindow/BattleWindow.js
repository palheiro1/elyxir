/* eslint-disable react-hooks/exhaustive-deps */
import { Box, IconButton, Img, SimpleGrid, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, CloseIcon } from '@chakra-ui/icons';
import { SelectHandPage } from './SelectHandPage';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import { getAccount } from '../../../../../services/Ardor/ardorInterface';
import { getSoldiers } from '../../../../../services/Battlegrounds/Battlegrounds';
import Loader from '../../../../Loader/Loader';
import { errorToast } from '../../../../../utils/alerts';

export const BattleWindow = ({ arenaInfo, handleCloseBattle, infoAccount, cards, filteredCards }) => {
    const [openIventory, setOpenIventory] = useState(false);
    const [index, setIndex] = useState('');
    const [defenderInfo, setDefenderInfo] = useState(null);
    const [handBattleCards, setHandBattleCards] = useState(['', '', '', '', '']);
    // eslint-disable-next-line no-unused-vars
    const [defenderCards, setDefenderCards] = useState(null);
    const [soldiers, setSoldiers] = useState(null);
    const [mediumBonus, setMediumBonus] = useState(0);
    const [domainBonus, setDomainBonus] = useState(0);
    const [domainName, setDomainName] = useState();

    const toast = useToast();

    const handleOpenInventory = index => {
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
                setSoldiers(res);
            });
        };
        getDefenderInfo();
    }, [arenaInfo, cards]);

    useEffect(() => {
        if (soldiers) calculateBonus();
    }, [handBattleCards]);



    const calculateBonus = () => {
        const arenaSoldier = soldiers.soldier.find(item => item.arenaId === arenaInfo.id);
        if (handBattleCards[index] !== '') {
            const cardInfo = soldiers.soldier.find(item => item.asset === handBattleCards[index].asset);
            if (cardInfo.mediumId === arenaInfo.mediumId) {
                setMediumBonus(mediumBonus + 1);
            }
            if (cardInfo.domainId === arenaSoldier.domainId) {
                setDomainBonus(domainBonus + 1);
            }
        }
        setDomainName(cards.find(card => card.asset === arenaSoldier.asset).channel);
    };

    const handleClose = () => {
        handleCloseBattle();
    };

    const updateCard = (newValue, index) => {
        setHandBattleCards(prevCards => {
            const assetExists = prevCards.some(card => card && card.asset === newValue.asset);
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
                                <SimpleGrid
                                    columns={[1, 2, 4]} // Ajuste responsive: 1 columna en pantallas pequeñas, 2 en medianas, 3 en grandes
                                    spacing={5}
                                    overflowY={'auto'}
                                    className="custom-scrollbar"
                                    p={5} // Añade algo de padding
                                    overflow={'scroll'}
                                    h={'750px'}>
                                    {filteredCards.map((card, cardIndex) => (
                                        <Box
                                            key={cardIndex}
                                            w={'350px'}
                                            h={'450px'}
                                            onClick={() => updateCard(card, cardIndex)}
                                            bg={'white'}
                                            borderRadius={'10px'}>
                                            <Img src={card.cardImgUrl} w={'100%'} h={'100%'} />
                                        </Box>
                                    ))}
                                </SimpleGrid>{' '}
                            </>
                        )}
                    </>
                )}
            </Box>
        </>
    );
};
