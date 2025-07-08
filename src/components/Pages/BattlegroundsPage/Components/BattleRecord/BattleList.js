import { useEffect, useState } from 'react';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import { Box, Heading, IconButton, Stack } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import BattleDetails from './BattleDetails';
import BattleListTable from './BattleListTable';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBattles } from '../../../../../redux/reducers/BattleReducer';

const BattleList = ({ handleClose, infoAccount, cards, isMobile }) => {
    const { accountRs } = infoAccount;

    const { arenasInfo, userBattles } = useSelector(state => state.battle);
    const [viewDetails, setViewDetails] = useState(false);
    const [selectedBattle, setSelectedBattle] = useState(null);
    const [selectedArena, setSelectedArena] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        accountRs && dispatch(fetchUserBattles(accountRs));
    }, [accountRs, dispatch]);

    const handleViewDetails = battleId => {
        setSelectedBattle(battleId);

        let arenaId = userBattles.find(battle => battle.battleId === battleId).arenaId;
        let arena = arenasInfo.find(arena => arena.id === arenaId);
        setSelectedArena(arena);
        setViewDetails(true);
    };

    const handleGoBack = () => {
        setSelectedBattle(null);
        setViewDetails(false);
    };

    const closeRecord = () => {
        setSelectedBattle(null);
        handleClose();
        setViewDetails(false);
    };

    return (
        <>
            <Overlay isVisible={true} handleClose={closeRecord} />
            <Box
                pos={'fixed'}
                bgColor={'#1F2323'}
                zIndex={99}
                w={isMobile ? '80%' : viewDetails ? '50%' : '70%'}
                h={viewDetails ? '95%' : '90%'}
                borderRadius={'25px'}
                overflowY={'hidden'}
                className="custom-scrollbar"
                top={'50%'}
                left={'50%'}
                transform={'translate(-50%, -50%)'}>
                <IconButton
                    background={'transparent'}
                    color={viewDetails ? '#000' : '#FFF'}
                    icon={<CloseIcon />}
                    _hover={{ background: 'transparent' }}
                    position="absolute"
                    top={2}
                    right={2}
                    zIndex={999}
                    onClick={closeRecord}
                />
                {!viewDetails && (
                    <>
                        <Stack direction={'column'} color={'#FFF'} my={5} mx={'auto'} textAlign={'center'} maxH={'90%'}>
                            <Heading fontFamily={'Chelsea Market, System'} fontWeight={100} fontSize={'2xl'}>
                                BATTLE RECORD
                            </Heading>
                        </Stack>
                        <BattleListTable
                            arenasInfo={arenasInfo}
                            handleViewDetails={handleViewDetails}
                            battleDetails={userBattles}
                            cards={cards}
                            isMobile={isMobile}
                        />
                    </>
                )}

                {viewDetails && (
                    <BattleDetails
                        battleId={selectedBattle}
                        cards={cards}
                        arenaInfo={selectedArena}
                        infoAccount={infoAccount}
                        battleDetails={userBattles.find(battle => battle.battleId === selectedBattle)}
                        handleGoBack={handleGoBack}
                    />
                )}
            </Box>
        </>
    );
};

export default BattleList;
