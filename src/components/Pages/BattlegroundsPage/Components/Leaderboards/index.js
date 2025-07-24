import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Stack, Select, Image, Text } from '@chakra-ui/react';
import { fetchAccountDetails, fetchLeaderboards, setViewData } from '../../../../../redux/reducers/LeaderboardsReducer';
import CombativityResetTimer from './CombativityLeaderboard/CombativityResetTimer';
import panteon from '../../assets/icons/panteon_banner.svg';
import landsBanner from '../../assets/icons/lands_banner.svg';
import waterBanner from '../../assets/icons/water_banner.svg';
import airBanner from '../../assets/icons/air_banner.svg';
import combativityBanner from '../../assets/icons/combativeness_banner.svg';
import { useBattlegroundBreakpoints } from '../../../../../hooks/useBattlegroundBreakpoints';
import TypesLeaderboardsRewards from './TypesLeaderboards/TypesLeaderboardsRewards';
import TypesLeaderboardsResetTimer from './TypesLeaderboards/TypesLeaderboardsResetTimer';
import TypesLeaderboard from './TypesLeaderboards';
import CombativityLeaderboard from './CombativityLeaderboard/CombativityLeaderboard';
import Modal from '../../../../ui/Modal';

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
                dispatch(fetchAccountDetails({ accounts: data.info, arenas: arenasInfo }));
            }
        }
    };

    const closeLeaderboards = () => {
        handleClose();
        changeData(0);
    };

    const availableLeaderboards = [
        {
            name: 'CHAMPIONS PANTHEON',
            value: 1,
            description:
                "The players' scores are calculated as the weighted sum of four elements. Each element is normalized using the formula (player score / highest score recorded), ensuring that the weighted value of every metric falls within the range of 0 to 1. Finally, the normalized values are summed to produce the total score, which will always range between 0 and 4.",
        },
        { name: 'TERRESTRIAL PANTHEON', value: 2 },
        { name: 'AERIAL PANTHEON', value: 3 },
        { name: 'AQUATIC PANTHEON', value: 4 },
        {
            name: 'CHAMPION OF FIERCENESS',
            value: 5,
            description:
                '1 point per battle initiated on common territory. 2 points per battle initiated on rare territory. 3 points per battle initiated on epic territory. 4 points per battle initiated on special territory.',
        },
    ];

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
                        w={isMobile ? '120px' : '190px'}
                        h={'75px'}
                    />
                    <Select
                        value={option}
                        onChange={e => changeData(Number(e.target.value))}
                        color={color()}
                        bgColor={'transparent'}
                        my={'auto'}
                        zIndex={999}
                        border={'none'}
                        fontFamily={'Chelsea Market, System'}
                        _hover={{ borderColor: '#555' }}
                        maxW={'270px'}>
                        {availableLeaderboards.map(({ name, value }, index) => {
                            return (
                                <option
                                    key={index}
                                    value={value}
                                    style={{
                                        backgroundColor: '#FFF',
                                        color: '#000',
                                    }}>
                                    {name}
                                </option>
                            );
                        })}
                    </Select>
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
                            <CombativityLeaderboard color={color} />
                        ) : (
                            <TypesLeaderboard
                                color={color}
                                handleFilterChange={handleFilterChange}
                                handleClose={handleClose}
                            />
                        )}
                    </Stack>
                    <Stack dir="row" mx={'auto'} w={'90%'}>
                        {option === 5 ? (
                            <CombativityResetTimer mb={isMobile ? 0 : 4} />
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
