/* eslint-disable react-hooks/exhaustive-deps */
import { Box, IconButton, Img, SimpleGrid, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, CloseIcon } from '@chakra-ui/icons';
import { SelectHandPage } from './SelectHandPage';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import { getAccount } from '../../../../../services/Ardor/ardorInterface';
import { getSoldiers } from '../../../../../services/Battlegrounds/Battlegrounds';
import { errorToast } from '../../../../../utils/alerts';
import BattleResults from './BattleResults';
import '@fontsource/chelsea-market';

export const BattleWindow = ({
    arenaInfo,
    handleCloseBattle,
    infoAccount,
    cards,
    filteredCards,
    omnoGEMsBalance,
    omnoWethBalance,
}) => {
    const [openIventory, setOpenIventory] = useState(false);
    const [index, setIndex] = useState('');
    const [defenderInfo, setDefenderInfo] = useState(null);
    const [handBattleCards, setHandBattleCards] = useState(['', '', '', '', '']);
    const [soldiers, setSoldiers] = useState(null);
    const [mediumBonus, setMediumBonus] = useState(0);
    const [domainBonus, setDomainBonus] = useState(0);
    const [domainName, setDomainName] = useState();
    const [showResults, setShowResults] = useState(false);
    const [currentTime, setCurrentTime] = useState();
    const [rank0Count, setRank0Count] = useState(0);
    const [rank1Count, setRank1Count] = useState(1);

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
                setSoldiers(res);
                return res;
            });
            const arenaSoldier = soldiers.soldier.find(item => item.arenaId === arenaInfo.id);
            setDomainName(cards.find(card => card.asset === arenaSoldier.asset).channel);
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
    };

    const handleClose = () => {
        handleCloseBattle();
    };

    const updateCard = newValue => {
        setHandBattleCards(prevCards => {
            const assetExists = prevCards.some(card => card && card.asset === newValue.asset);
            const soldier = soldiers.soldier.find(item => item.asset === newValue.asset);

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
            const soldier = soldiers.soldier.find(item => item.asset === newCards[index].asset);

            if (soldier.rank === 0) {
                setRank0Count(rank0Count - 1);
            } else if (soldier.rank === 1) {
                setRank1Count(rank1Count - 1);
            }

            const arenaSoldier = soldiers.soldier.find(item => item.arenaId === arenaInfo.id);

            const cardInfo = soldiers.soldier.find(item => item.asset === newCards[index].asset);
            if (cardInfo.mediumId === arenaInfo.mediumId) {
                setMediumBonus(mediumBonus - 1);
            }
            if (cardInfo.domainId === arenaSoldier.domainId) {
                setDomainBonus(domainBonus - 1);
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
                                deleteCard={deleteCard}
                                domainBonus={domainBonus}
                                mediumBonus={mediumBonus}
                                domainName={domainName}
                                infoAccount={infoAccount}
                                omnoGEMsBalance={omnoGEMsBalance}
                                omnoWethBalance={omnoWethBalance}
                                setShowResults={setShowResults}
                                setCurrentTime={setCurrentTime}
                            />
                        )}
                        {openIventory && (
                            <>
                                <IconButton
                                    icon={<ChevronLeftIcon boxSize={8} />}
                                    mt={3}
                                    p={5}
                                    bg={'transparent'}
                                    color={'#FFF'}
                                    _hover={{ bg: 'transparent' }}
                                    onClick={() => setOpenIventory(false)}>
                                    Go back
                                </IconButton>
                                <Stack direction={'row'} pt={2} padding={5} height={'90%'}>
                                    <Box
                                        mb={2}
                                        borderRadius={'20px'}
                                        p={4}
                                        w={'90%'}
                                        mx={'auto'}
                                        overflowY={'scroll'}
                                        className="custom-scrollbar">
                                        <SimpleGrid
                                            columns={[1, 2, 4]}
                                            spacing={5}
                                            overflowY={'auto'}
                                            className="custom-scrollbar"
                                            p={5}
                                            overflow={'scroll'}
                                            h={'750px'}>
                                            {filteredCards.map((card, cardIndex) => {
                                                return card.asset.length <= 19 ? (
                                                    <Box
                                                        key={cardIndex}
                                                        w={'250px'}
                                                        h={'350px'}
                                                        onClick={() => {
                                                            setOpenIventory(false);
                                                            updateCard(card);
                                                        }}
                                                        bg={'white'}
                                                        borderRadius={'10px'}>
                                                        <Img src={card.cardImgUrl} w={'100%'} h={'100%'} />
                                                    </Box>
                                                ) : null;
                                            })}
                                        </SimpleGrid>
                                    </Box>
                                    <Text
                                        color={'red'}
                                        position={'absolute'}
                                        fontFamily={'Chelsea Market, system-ui'}
                                        bottom={2}>
                                        * Some cards don't appear to play battles with them, because of code problems.
                                        We are working to solve it
                                    </Text>
                                </Stack>
                            </>
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
