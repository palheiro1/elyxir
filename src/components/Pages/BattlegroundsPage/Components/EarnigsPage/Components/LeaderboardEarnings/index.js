import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import LeaderboardEaringsRow from './LeaderboardEaringsRow';
import LeaderboardRewards from './LeaderboardRewards';
import LeaderboardEarningsHeader from './LeaderboardEarningsHeader';

/**
 * @name LeaderboardsEarnings
 * @description Displays the user's leaderboard earnings by filtering and grouping transactions
 * that contain leaderboard-related data. Shows a table with date, pantheon type,
 * and rewards earned (GEM, WETH, MANA, GIFTZ, and special cards). Also displays
 * an all-time total summary of rewards.
 * Filters the transactions by parsing their message attachment to identify
 * leaderboard transactions. Groups them by leaderboard end block for display.
 * @param {Object} props
 * @param {Object} props.infoAccount - User account data containing transaction history.
 * @param {Array} props.cards - Array of cards data used for rendering special card info.
 * @param {boolean} props.isMobile - Indicates if the view is in mobile mode for responsive design.
 * @returns {JSX.Element} The rendered leaderboard earnings component.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const LeaderboardsEarnigs = ({ infoAccount, cards, isMobile }) => {
    const { transactions } = infoAccount;
    const [filteredTransactions, setFilteredTransactions] = useState(null);
    const [allTimeRewards, setAllTimeRewards] = useState({
        giftz: 0,
        gem: 0,
        weth: 0,
        mana: 0,
        cards: 0,
    });
    useEffect(() => {
        const filterTransactions = transactions
            .filter(transaction => {
                try {
                    const messageObj = JSON.parse(transaction.attachment.message);
                    return messageObj.leaderboardType ? true : false;
                } catch (error) {
                    return false;
                }
            })
            .map(transaction => {
                const messageObj = JSON.parse(transaction.attachment.message);
                return {
                    ...transaction,
                    leaderboardType: messageObj.leaderboardType,
                    leaderboardEndBlock: messageObj.leaderboardEndBlock,
                };
            })
            .reduce((groups, transaction) => {
                const endBlock = transaction.leaderboardEndBlock;

                if (!groups[endBlock]) {
                    groups[endBlock] = [];
                }
                groups[endBlock].push(transaction);
                return groups;
            }, {});

        setFilteredTransactions(filterTransactions);
    }, [transactions]);
    return (
        <>
            <LeaderboardEarningsHeader isMobile={isMobile} />
            <Box
                height={isMobile ? '40vh' : '60vh'}
                overflowY="auto"
                bgColor={'inherit'}
                w={'90%'}
                mx={'auto'}
                borderRadius={'10px'}
                p={2}>
                {filteredTransactions && Object.values(filteredTransactions).length > 0 ? (
                    Object.values(filteredTransactions).map((data, index) => (
                        <LeaderboardEaringsRow
                            key={index}
                            isMobile={isMobile}
                            cards={cards}
                            leaderboardData={data}
                            setAllTimeRewards={setAllTimeRewards}
                        />
                    ))
                ) : (
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
                        <Text>You have not won any reward yet</Text>
                    </Box>
                )}
            </Box>
            <LeaderboardRewards allTimeRewards={allTimeRewards} isMobile={isMobile} />
        </>
    );
};

export default LeaderboardsEarnigs;
