import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Stack, Image, Text, MenuItem, MenuList, Flex, Button, MenuButton, Menu } from '@chakra-ui/react';
import { fetchAccountDetails, fetchLeaderboards, setViewData } from '../../../../../redux/reducers/LeaderboardsReducer';
import CombativityResetTimer from './CombativityLeaderboard/CombativityResetTimer';

import { useBattlegroundBreakpoints } from '../../../../../hooks/useBattlegroundBreakpoints';
import TypesLeaderboardsRewards from './TypesLeaderboards/TypesLeaderboardsRewards';
import TypesLeaderboardsResetTimer from './TypesLeaderboards/TypesLeaderboardsResetTimer';
import TypesLeaderboard from './TypesLeaderboards';
import CombativityLeaderboard from './CombativityLeaderboard/CombativityLeaderboard';
import Modal from '../../../../ui/Modal';
import { ChevronDownIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import ResponsiveTooltip from '../../../../ui/ReponsiveTooltip';
import { availableLeaderboards, bannerImages, leaderboardsColors } from './data';

/**
 * @name Leaderboards
 * @description Main container component for displaying various leaderboards.
 * Fetches leaderboard data on mount, allows user to select between
 * different leaderboard types, displays relevant leaderboard UI,
 * banners, descriptions, and reset timers.
 * @param {Object} props - Component props.
 * @param {Function} props.handleClose - Function to close the leaderboard overlay.
 * @returns {JSX.Element} The leaderboards component UI.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const Leaderboards = ({ handleClose, handleFilterChange }) => {
    const dispatch = useDispatch();
    const { leaderboards, data } = useSelector(state => state.leaderboards);
    const [option, setOption] = useState(1);
    const { isMobile } = useBattlegroundBreakpoints();
    const { arenasInfo } = useSelector(state => state.arenas);

    useEffect(() => {
        dispatch(fetchLeaderboards());
        changeData(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

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
                dispatch(fetchAccountDetails({ accounts: data.info, arenas: arenasInfo }));
            }
        }
    };

    const closeLeaderboards = () => {
        handleClose();
        changeData(0);
    };

    const bannerSrc = bannerImages[option - 1];
    const leaderboardColor = leaderboardsColors[data.type];

    return (
        <Modal
            isVisible
            onClose={closeLeaderboards}
            width={isMobile ? '100%' : '70%'}
            height={isMobile ? '100%' : '90%'}>
            <Stack boxSize={'100%'}>
                <Stack
                    direction={'row'}
                    color={'#FFF'}
                    mt={isMobile ? 3 : 10}
                    mx={'auto'}
                    w={'80%'}
                    textAlign={'center'}
                    justifyContent={'space-between'}>
                    <Text
                        fontFamily={'Chelsea Market, System'}
                        fontWeight={100}
                        my={'auto'}
                        fontSize={isMobile ? 'md' : '3xl'}>
                        LEADERBOARDS
                    </Text>

                    <Image src={bannerSrc} w={isMobile ? '120px' : '190px'} h={'75px'} />
                    <Flex align="center" gap={2}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                mt={1}
                                rightIcon={<ChevronDownIcon />}
                                fontFamily="Chelsea Market, System"
                                bg="transparent"
                                border="none"
                                color={leaderboardColor}
                                fontSize={'lg'}
                                maxW="300px"
                                _hover={{ borderColor: '#555' }}>
                                {availableLeaderboards.find(lb => lb.value === option)?.name}
                            </MenuButton>
                            <MenuList zIndex={9999} bgColor={'#FFF'}>
                                {availableLeaderboards.map(({ name, value }, index) => (
                                    <MenuItem
                                        key={index}
                                        onClick={() => changeData(value)}
                                        fontFamily="Chelsea Market, System"
                                        bgColor={'#FFF'}
                                        _hover={{ bgColor: 'rgba(0, 0, 0, 0.4)' }}
                                        color={'#000'}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>

                        <ResponsiveTooltip
                            label={availableLeaderboards.find(lb => lb.value === option)?.description}
                            mt="-2">
                            <span>
                                <InfoOutlineIcon cursor="pointer" color={'#C3C3C3'} />
                            </span>
                        </ResponsiveTooltip>
                    </Flex>
                </Stack>
                <Stack
                    direction={'column'}
                    color={'#FFF'}
                    mx={'auto'}
                    w={'100%'}
                    textAlign={'center'}
                    h={isMobile ? '100%' : '80%'}>
                    <Stack
                        direction={'column'}
                        my={'auto'}
                        mt={isMobile ? 0 : 2}
                        fontFamily={'Chelsea Market, System'}
                        mb={0}
                        h={isMobile ? '70%' : '80%'}>
                        {option === 5 ? (
                            <CombativityLeaderboard color={leaderboardColor} />
                        ) : (
                            <TypesLeaderboard
                                color={leaderboardColor}
                                handleFilterChange={handleFilterChange}
                                handleClose={handleClose}
                            />
                        )}
                    </Stack>
                    <Stack dir="row" mx={'auto'} w={'90%'}>
                        {option === 5 ? (
                            <CombativityResetTimer option={option} mb={isMobile ? 0 : 4} />
                        ) : (
                            <Stack
                                direction={'row'}
                                mb={isMobile ? 0 : 4} 
                                align={'baseline'}
                                justifyContent={'space-between'}>
                                <TypesLeaderboardsRewards option={option} />
                                <TypesLeaderboardsResetTimer />
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            </Stack>
        </Modal>
    );
};

export default Leaderboards;
