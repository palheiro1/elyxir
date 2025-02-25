/* eslint-disable react-hooks/exhaustive-deps */
import { Box, IconButton, Spinner, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CloseIcon } from '@chakra-ui/icons';
import { SelectHandPage } from './SelectHandPage';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import { getAccount } from '../../../../../services/Ardor/ardorInterface';
import { getSoldiers } from '../../../../../services/Battlegrounds/Battlegrounds';
import { errorToast } from '../../../../../utils/alerts';
import BattleResults from './BattleResults';
import '@fontsource/chelsea-market';
import BattleInventory from './BattleInventory';

export const BattleWindow = ({
    arenaInfo,
    handleCloseBattle,
    infoAccount,
    cards,
    filteredCards,
    omnoGEMsBalance,
    omnoWethBalance,
    isMobile,
}) => {
    const [openIventory, setOpenIventory] = useState(false);
    const [index, setIndex] = useState('');
    const [defenderInfo, setDefenderInfo] = useState(null);
    const [handBattleCards, setHandBattleCards] = useState(Array(5).fill(''));
    const [soldiers, setSoldiers] = useState(null);
    const [mediumBonus, setMediumBonus] = useState(0);
    const [domainBonus, setDomainBonus] = useState(0);
    const [domainName, setDomainName] = useState();
    const [showResults, setShowResults] = useState(false);
    const [currentTime, setCurrentTime] = useState();
    const [rank0Count, setRank0Count] = useState(0);
    const [rank1Count, setRank1Count] = useState(1);
    const [defenderCards, setDefenderCards] = useState(null);
    const [filters, setFilters] = useState({
        rarity: '',
        element: '',
        domain: '',
    });

    const handleRarityChange = event => {
        setFilters(prevFilters => ({
            ...prevFilters,
            rarity: event.target.value,
        }));
    };

    const handleElementChange = event => {
        setFilters(prevFilters => ({
            ...prevFilters,
            element: event.target.value,
        }));
    };

    const handleDomainChange = event => {
        setFilters(prevFilters => ({
            ...prevFilters,
            domain: event.target.value,
        }));
    };
    const toast = useToast();

    const handleOpenInventory = index => {
        setIndex(index);
        setOpenIventory(true);
    };

    useEffect(() => {
        const getDefenderInfo = async () => {
            await getAccount(arenaInfo.defender.account).then(res => {
                setDefenderInfo(res);
            });
            const soldiers = await getSoldiers().then(res => {
                setSoldiers(res.soldier);
                return res;
            });
            const arenaSoldier = soldiers.soldier.find(item => item.arenaId === arenaInfo.id);
            setDomainName(cards.find(card => card.asset === arenaSoldier.asset).channel);

            const defenderAssets = new Set(arenaInfo.defender.asset);
            const matchingObjects = cards.filter(obj => defenderAssets.has(obj.asset));
            setDefenderCards(matchingObjects);
        };
        getDefenderInfo();
    }, [arenaInfo, cards]);

    useEffect(() => {
        if (soldiers) calculateBonus();
    }, [handBattleCards]);

    const calculateBonus = () => {
        const arenaSoldier = soldiers.find(item => item.arenaId === arenaInfo.id);
        if (handBattleCards[index] !== '') {
            const cardInfo = soldiers.find(item => item.asset === handBattleCards[index].asset);
            if (cardInfo.mediumId === arenaInfo.mediumId) {
                setMediumBonus(mediumBonus + 1);
            }
            if (cardInfo.domainId === arenaSoldier.domainId) {
                setDomainBonus(domainBonus + 1);
            }
        }
    };

    const handleClose = () => {
        handleCloseBattle();
    };

    const updateCard = newValue => {
        setHandBattleCards(prevCards => {
            const assetExists = prevCards.some(card => card && card.asset === newValue.asset);
            const soldier = soldiers.find(item => item.asset === newValue.asset);
            if (assetExists) {
                errorToast('You cannot send repeated cards to battle', toast);
                return prevCards;
            }
            if (soldier.rank === 0 && rank0Count > arenaInfo.armyRankMinimum[1]) {
                errorToast(`You cannot have more than ${arenaInfo.armyRankMinimum[1]} special/epic in battle`, toast);
                return prevCards;
            }
            if (soldier.rank === 1 && rank1Count > arenaInfo.armyRankMaximum[0]) {
                errorToast(`You cannot have more than ${arenaInfo.armyRankMaximum[0]} common cards in battle`, toast);
                return prevCards;
            }

            if (soldier.rank === 0) {
                setRank0Count(rank0Count + 1);
            } else if (soldier.rank === 1) {
                setRank1Count(rank1Count + 1);
            }

            const newCards = [...prevCards];
            newCards[index] = newValue;
            return newCards;
        });
    };

    const deleteCard = index => {
        setHandBattleCards(prevCards => {
            const newCards = [...prevCards];
            const cardToDelete = newCards[index];

            const soldier = soldiers.find(item => item.asset === cardToDelete.asset);

            if (soldier) {
                if (soldier.rank === 0) {
                    setRank0Count(prevCount => prevCount - 1);
                } else if (soldier.rank === 1) {
                    setRank1Count(prevCount => prevCount - 1);
                }

                const arenaSoldier = soldiers.find(item => item.arenaId === arenaInfo.id);

                if (soldier.mediumId === arenaInfo.mediumId) {
                    setMediumBonus(prevBonus => prevBonus - 1);
                }
                if (arenaSoldier && soldier.domainId === arenaSoldier.domainId) {
                    setDomainBonus(prevBonus => prevBonus - 1);
                }
            }

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
                w={(!openIventory && !showResults && defenderInfo) || showResults ? '50%' : '80%'}
                h={'90%'}
                borderRadius={'25px'}
                top={'50%'}
                left={'50%'}
                transform={'translate(-50%, -50%)'}>
                <IconButton
                    background={'transparent'}
                    color={showResults ? '#000' : '#FFF'}
                    icon={<CloseIcon />}
                    _hover={{ background: 'transparent' }}
                    position="absolute"
                    top={2}
                    right={2}
                    zIndex={999}
                    onClick={handleClose}
                />
                {!soldiers && (
                    <Box
                        h={'100%'}
                        position={'absolute'}
                        color={'#FFF'}
                        alignContent={'center'}
                        top={'50%'}
                        left={'50%'}
                        w={'100%'}
                        textAlign={'center'}
                        transform={'translate(-50%, -50%)'}>
                        <Spinner color="#FFF" w={20} h={20} />
                    </Box>
                )}
                {soldiers && (
                    <>
                        {!openIventory && !showResults && defenderInfo && (
                            <SelectHandPage
                                arenaInfo={arenaInfo}
                                handleOpenInventory={handleOpenInventory}
                                handBattleCards={handBattleCards}
                                openInventory={handleOpenInventory}
                                defenderInfo={defenderInfo}
                                defenderCards={defenderCards}
                                deleteCard={deleteCard}
                                domainBonus={domainBonus}
                                mediumBonus={mediumBonus}
                                domainName={domainName}
                                infoAccount={infoAccount}
                                omnoGEMsBalance={omnoGEMsBalance}
                                omnoWethBalance={omnoWethBalance}
                                setShowResults={setShowResults}
                                setCurrentTime={setCurrentTime}
                                isMobile={isMobile}
                            />
                        )}
                        {openIventory && (
                            <BattleInventory
                                setOpenIventory={setOpenIventory}
                                filteredCards={filteredCards}
                                index={index}
                                handBattleCards={handBattleCards}
                                updateCard={updateCard}
                                isMobile={isMobile}
                                arenaInfo={arenaInfo}
                                filters={filters}
                                handleRarityChange={handleRarityChange}
                                handleElementChange={handleElementChange}
                                handleDomainChange={handleDomainChange}
                            />
                        )}
                        {showResults && (
                            <BattleResults
                                infoAccount={infoAccount}
                                currentTime={currentTime}
                                cards={cards}
                                arenaInfo={arenaInfo}
                                domainName={domainName}
                                defenderInfo={defenderInfo}
                            />
                        )}
                    </>
                )}
            </Box>
        </>
    );
};
