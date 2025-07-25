import { useSelector } from 'react-redux';
import { Box, Spinner, Stack, Text } from '@chakra-ui/react';
import TypesLeaderboardRow from './TypesLeaderboardRow';
import TypesLeaderboardsHeader from './TypesLeaderboardsHeader';
import { useBattlegroundBreakpoints } from '../../../../../../hooks/useBattlegroundBreakpoints';

/**
 * @name TypesLeaderboard
 * @description Displays the leaderboard for conquest-type battles. Shows a loading spinner while data is being fetched,
 * and renders a fixed header along with participant rows when data is available. If there are no participants,
 * a message is shown. The layout adapts to mobile or desktop views.
 * @param {Object} props - Component props.
 * @param {string} props.color - Color used for the leaderboard header background.
 * @returns {JSX.Element} A stacked view of the leaderboard with header and scrollable participant rows.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const TypesLeaderboard = ({ color, handleFilterChange, handleClose }) => {
    const { entries, data } = useSelector(state => state.leaderboards);
    const { isMobile } = useBattlegroundBreakpoints();

    const handleSetDefenderFilter = value => {
        const typesMapping = {
            terrestrial: 1,
            aerial: 2,
            aquatic: 3,
        };
        handleFilterChange('defender', value);
        if (data.type !== 'general') {
            handleFilterChange('element', typesMapping[data.type]);
        }

        handleClose();
    };

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
            <TypesLeaderboardsHeader color={color} />
            <Box
                maxHeight={isMobile ? '30vh' : '45vh'}
                overflowY="auto"
                bgColor="#323636"
                w="90%"
                mx="auto"
                borderRadius="10px"
                p={2}>
                {entries.map((entry, index) => (
                    <TypesLeaderboardRow
                        key={index}
                        index={index}
                        data={entry}
                        isMobile={isMobile}
                        type={data.type}
                        handleSetDefenderFilter={handleSetDefenderFilter}
                    />
                ))}
            </Box>
        </>
    );

    let content;

    if (entries === null) {
        content = renderLoading();
    } else if (entries.length === 0) {
        content = renderEmpty();
    } else {
        content = renderTable();
    }

    return <Stack className="custom-scrollbar">{content}</Stack>;
};

export default TypesLeaderboard;
