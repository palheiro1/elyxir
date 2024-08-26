import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import { Box, Heading, IconButton, Spinner, Stack, Text } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import Leaderboard from './Leaderboard';
import {
    fetchAccountDetails,
    fetchLeaderboards,
    resetState,
    setViewData,
} from '../../../../../redux/reducers/LeaderboardsReducer';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';
import { isEmptyObject } from '../../Utils/BattlegroundsUtils';
import { getAccumulatedBounty } from '../../../../../services/Battlegrounds/Battlegrounds';
import { getAsset } from '../../../../../services/Ardor/ardorInterface';

const Leaderboards = ({ handleClose, isMobile }) => {
    const dispatch = useDispatch();
    const { leaderboards, viewData, data, status } = useSelector(state => state.leaderboards);
    const [accumulatedBounty, setAccumulatedBounty] = useState({});

    useEffect(() => {
        dispatch(fetchLeaderboards());
    }, [dispatch]);

    useEffect(() => {
        const getBattleCost = async () => {
            let res = await getAccumulatedBounty();
            if (!isEmptyObject(res)) {
                const assets = Object.entries(res.asset);

                const results = await Promise.all(
                    assets.map(async ([asset, price]) => {
                        const assetDetails = await getAsset(asset);
                        return { ...assetDetails, price };
                    })
                );
                setAccumulatedBounty(results);
            }
        };

        getBattleCost();
    }, []);

    const changeData = option => {
        if (leaderboards) {
            let data = {
                type: null,
                info: [],
            };
            switch (option) {
                case 1:
                    data.type = 'general';
                    data.info = leaderboards.general;
                    break;
                case 2:
                    data.type = 'terrestrial';
                    data.info = leaderboards.terrestrial;
                    break;
                case 3:
                    data.type = 'aerial';
                    data.info = leaderboards.aerial;
                    break;
                case 4:
                    data.type = 'aquatic';
                    data.info = leaderboards.aquatic;
                    break;
                case 5:
                    data.type = 'combativity';
                    data.info = leaderboards.combativity;
                    break;
                default:
                    break;
            }
            dispatch(setViewData({ viewData: true, data }));
            if (data.info.length > 0) {
                dispatch(fetchAccountDetails(data.info));
            }
        }
    };

    const closeLeaderboards = () => {
        handleClose();
        dispatch(resetState());
    };

    const handleGoBack = () => {
        dispatch(resetState());
    };

    const availableLeaderboards = [
        { name: 'General', option: 1 },
        { name: 'Terrestrial', option: 2 },
        { name: 'Aerial', option: 3 },
        { name: 'Aquatic', option: 4 },
        { name: 'Combativity', option: 5 },
    ];

    return (
        <>
            <Overlay isVisible={true} handleClose={closeLeaderboards} />
            <Box
                pos={'fixed'}
                bgColor={'#1F2323'}
                zIndex={99}
                w={isMobile ? '80%' : '70%'}
                h={'90%'}
                borderRadius={'25px'}
                overflowY={'scroll'}
                className="custom-scrollbar"
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
                    onClick={closeLeaderboards}
                />
                {status === 'loading' ? (
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
                ) : (
                    <>
                        {!viewData ? (
                            <Stack
                                direction={'column'}
                                color={'#FFF'}
                                my={5}
                                mx={'auto'}
                                textAlign={'center'}
                                h={'90%'}>
                                <Heading fontFamily={'Chelsea Market, System'} fontWeight={100}>
                                    LEADERBOARDS
                                </Heading>
                                <Stack m={'auto'} mt={6}>
                                    {availableLeaderboards.map(({ name, option }, index) => (
                                        <Box
                                            mx={'auto'}
                                            className="btn-menu"
                                            cursor={'pointer'}
                                            key={index}
                                            onClick={() => changeData(option)}>
                                            {name}
                                        </Box>
                                    ))}
                                    <Stack
                                        direction={'column'}
                                        my={'auto'}
                                        mt={2}
                                        fontFamily={'Chelsea Market, System'}>
                                        {accumulatedBounty && (
                                            <>
                                                <Text>Accumulated bounty: </Text>
                                                {!isEmptyObject(accumulatedBounty) ? (
                                                    accumulatedBounty.map(({ price, name }, index) => (
                                                        <Text key={index} color={'#FFF'}>
                                                            {(price / NQTDIVIDER).toFixed(2)} {name}
                                                        </Text>
                                                    ))
                                                ) : (
                                                    <Text color={'#FFF'}>There are no accumulated bounty yet.</Text>
                                                )}
                                            </>
                                        )}
                                    </Stack>
                                </Stack>
                            </Stack>
                        ) : (
                            <Leaderboard data={data} handleGoBack={handleGoBack} isMobile={isMobile} />
                        )}
                    </>
                )}
            </Box>
        </>
    );
};

export default Leaderboards;
