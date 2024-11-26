import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import { Box, Heading, IconButton, Spinner, Stack, Text, Select, Image, Tooltip } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import Leaderboard from './Leaderboard';
import { fetchAccountDetails, fetchLeaderboards, setViewData } from '../../../../../redux/reducers/LeaderboardsReducer';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';
import { isEmptyObject } from '../../Utils/BattlegroundsUtils';
import { getAccumulatedBounty } from '../../../../../services/Battlegrounds/Battlegrounds';
import { getAsset } from '../../../../../services/Ardor/ardorInterface';
import GeneralLeaderboard from './GeneralLeaderboard';
import CombativityResetTimer from './CombativityResetTimer';
import panteon from '../../assets/icons/panteon_banner.svg';
import landsBanner from '../../assets/icons/lands_banner.svg';
import waterBanner from '../../assets/icons/water_banner.svg';
import airBanner from '../../assets/icons/air_banner.svg';
import combativityBanner from '../../assets/icons/combativeness_banner.svg';

const Leaderboards = ({ handleClose, isMobile }) => {
    const dispatch = useDispatch();
    const { leaderboards, data } = useSelector(state => state.leaderboards);

    const [accumulatedBounty, setAccumulatedBounty] = useState(null);
    const [option, setOption] = useState(1);

    useEffect(() => {
        dispatch(fetchLeaderboards());
        changeData(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        const getBattleCost = async () => {
            let res = await getAccumulatedBounty();
            setAccumulatedBounty({});
            if (res && !isEmptyObject(res)) {
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

    const color = () => {
        if (!data) return;
        switch (data.type) {
            case 'terrestrial':
                return '#866678';
            case 'aquatic':
                return '#393CC1';
            case 'aerial':
                return '#5E67A2';
            case 'combativity':
                return '#FF4B85';
            case 'general':
                return '#FFD900';
            default:
                return null;
        }
    };

    const changeData = option => {
        if (leaderboards && option !== 0) {
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
                    data.info = [];
                    data.type = null;
                    dispatch(setViewData({ viewData: false, data }));
                    break;
            }

            setOption(option);
            if (option !== 0) {
                dispatch(setViewData({ viewData: true, data }));
                dispatch(fetchAccountDetails(data.info));
            }
        }
    };

    const closeLeaderboards = () => {
        handleClose();
        changeData(0);
    };

    const availableLeaderboards = [
        { name: 'CHAMPIONS PANTHEON', value: 1, description: 'Lorem ajhagh champions' },
        { name: 'TERRESTRIAL PANTHEON', value: 2, description: 'Lorem ajhagh lands' },
        { name: 'AERAIL PANTHEON', value: 3, description: 'Lorem ajhagh sky' },
        { name: 'AQUATIC PANTHEON', value: 4, description: 'Lorem ajhagh oceans' },
        { name: 'CHAMPION OF FIRECENESS', value: 5, description: 'Lorem ajhagh combativeness loagaj asaq a0an asa' },
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
                <Tooltip
                    bgColor={color()}
                    borderRadius={'10px'}
                    w={'200px'}
                    h={'250px'}
                    label={
                        <Box>
                            <Text fontFamily={'Chelsea Market, System'} mt={1} textAlign={'center'}>
                                {availableLeaderboards.find(item => item.value === option).name}
                            </Text>
                            <Text fontWeight={'100'}>
                                {availableLeaderboards.find(item => item.value === option).description}
                            </Text>
                        </Box>
                    }
                    fontSize="md"
                    placement="top"
                    hasArrow>
                    <Image
                        background={'transparent'}
                        color={'#FFF'}
                        src="/images/battlegrounds/info.svg"
                        position="absolute"
                        bottom={10}
                        right={10}
                        zIndex={999}
                        boxSize={'40px'}
                    />
                </Tooltip>
                <>
                    <Stack
                        direction={'row'}
                        color={'#FFF'}
                        mt={10}
                        mx={'auto'}
                        w={'80%'}
                        textAlign={'center'}
                        justifyContent={'space-between'}>
                        <Heading fontFamily={'Chelsea Market, System'} fontWeight={100} my={'auto'}>
                            LEADERBOARDS
                        </Heading>

                        <Image
                            src={(() => {
                                switch (option) {
                                    case 1:
                                        return panteon;
                                    case 2:
                                        return landsBanner;
                                    case 3:
                                        return airBanner;
                                    case 4:
                                        return waterBanner;
                                    case 5:
                                        return combativityBanner;
                                    default:
                                        return null;
                                }
                            })()}
                            w={'190px'}
                            h={'75px'}
                        />
                        <Select
                            value={option}
                            onChange={e => changeData(Number(e.target.value))}
                            color={'#000'}
                            bgColor={'#FFF'}
                            my={'auto'}
                            zIndex={999}
                            fontFamily={'Chelsea Market, System'}
                            _hover={{ borderColor: '#555' }}
                            maxW={'260px'}>
                            {availableLeaderboards.map(({ name, value }, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={value}
                                        style={{
                                            backgroundColor: '#FFF',
                                        }}>
                                        {name}
                                    </option>
                                );
                            })}
                        </Select>
                    </Stack>
                    <Stack direction={'column'} color={'#FFF'} mx={'auto'} textAlign={'center'} h={'85%'}>
                        <Stack
                            direction={'column'}
                            my={'auto'}
                            mt={2}
                            fontFamily={'Chelsea Market, System'}
                            mb={0}
                            h={'85%'}>
                            {option !== 1 ? (
                                <Leaderboard isMobile={isMobile} color={color} />
                            ) : (
                                <GeneralLeaderboard isMobile={isMobile} />
                            )}
                        </Stack>
                        <Stack dir="row" mx={'auto'}>
                            {option === 5 ? (
                                <CombativityResetTimer mt={5} />
                            ) : accumulatedBounty ? (
                                <Stack
                                    direction="row"
                                    align="center"
                                    fontFamily={'Inter, system'}
                                    fontSize={'md'}
                                    w={'100%'}
                                    mt={5}
                                    fontWeight={700}>
                                    {accumulatedBounty && !isEmptyObject(accumulatedBounty) ? (
                                        <>
                                            <Text>ACCUMULATED BOUNTY: </Text>
                                            {accumulatedBounty.map(({ price, name }, index) => (
                                                <Stack key={index} direction="row" align="center" mx={4}>
                                                    <Text my={'auto'}>
                                                        {name === 'wETH'
                                                            ? (price / NQTDIVIDER).toFixed(4)
                                                            : (price / NQTDIVIDER).toFixed(0)}
                                                        {` ${name}`}
                                                    </Text>
                                                    <Image
                                                        my={'auto'}
                                                        src={`images/currency/${name === 'wETH' ? 'weth' : 'gem'}.png`}
                                                        alt={`${name === 'wETH' ? 'WETH' : 'GEM'} Icon`}
                                                        w="40px"
                                                        h="40px"
                                                        mt={-2}
                                                    />
                                                </Stack>
                                            ))}
                                        </>
                                    ) : (
                                        <Text color={'#FFF'}>THERE ARE NO ACCUMULATED BOUNTY YET.</Text>
                                    )}
                                </Stack>
                            ) : (
                                <Box mx={'auto'} mt={5}>
                                    <Spinner />
                                </Box>
                            )}
                        </Stack>
                    </Stack>
                </>
            </Box>
        </>
    );
};

export default Leaderboards;
