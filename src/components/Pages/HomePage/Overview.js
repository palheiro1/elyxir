import { Box, Stack } from '@chakra-ui/react';
// import { Timeline } from 'react-twitter-widgets';
import Jackpot from '../../JackpotWidget/JackpotWidget';
//import LatestTransaction from './LatestTransactions/LatestTransaction';
import News from './News/News';

const Overview = ({ blockchainStatus }) => {
    return (
        <Box>
            <Jackpot blockchainStatus={blockchainStatus} />
            <Stack direction={{ base: 'column', xl: 'row' }} spacing={4}>
                {/* 
                <Box>
                    <LatestTransaction/>
                </Box>
                
                <Box minW="33%" height="100%">
                    <Timeline
                        dataSource={{
                            sourceType: 'url',
                            url: 'https://twitter.com/BeingsMythical',
                        }}
                        options={{
                            chrome: 'noheader, nofooter',
                            height: '1600px',
                            theme: 'dark',
                        }}
                    />
                </Box>
                */}
                <Box>
                    <News />
                </Box>
            </Stack>
        </Box>
    );
};

export default Overview;
