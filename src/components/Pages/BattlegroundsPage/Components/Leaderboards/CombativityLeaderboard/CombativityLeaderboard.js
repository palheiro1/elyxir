import { useSelector } from 'react-redux';
import { Box, Spinner, Stack, Text } from '@chakra-ui/react';
import CombativityLeaderboardRow from './CombativityLeaderboardRow';
import CombativityLeaderboardHeader from './CombativityLeaderboardHeader';

/**
 * @name CombativityLeaderboard
 * @description Displays a CombativityLeaderboard with participant rankings, names, and points.
 * Shows a spinner while loading, a message if no participants are available,
 * and a styled table of entries otherwise.
 * @param {Object} props - Component props.
 * @param {string} props.color - Background color for the header row.
 * @returns {JSX.Element} The CombativityLeaderboard component UI.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CombativityLeaderboard = ({ color }) => {
    const { entries } = useSelector(state => state.leaderboards);

    const renderLoading = () => (
        <Box
            h="100%"
            position="absolute"
            color="#FFF"
            alignContent="center"
            top="50%"
            left="50%"
            w="100%"
            textAlign="center"
            transform="translate(-50%, -50%)">
            <Spinner color="#FFF" w={20} h={20} />
        </Box>
    );

    const renderEmpty = () => (
        <Box
            h="100%"
            position="absolute"
            color="#FFF"
            alignContent="center"
            top="50%"
            left="50%"
            w="100%"
            textAlign="center"
            transform="translate(-50%, -50%)">
            <Text fontFamily="Chelsea Market, System" fontWeight={100} fontSize="medium">
                No participants yet
            </Text>
        </Box>
    );

    const renderTable = () => (
        <>
            <CombativityLeaderboardHeader color={color} />
            <Box maxHeight="55vh" overflowY="auto" w="90%" mx="auto" borderRadius="10px" p={2}>
                {entries.map((entry, index) => (
                    <CombativityLeaderboardRow key={index} index={index} {...entry} />
                ))}
            </Box>
        </>
    );

    let content;

    if (entries === null) {
        content = renderLoading();
    } else if (!entries || entries.length === 0) {
        content = renderEmpty();
    } else {
        content = renderTable();
    }

    return (
        <Stack overflowY="auto" className="custom-scrollbar" maxHeight="80vh" w="100%">
            {content}
        </Stack>
    );
};

export default CombativityLeaderboard;
