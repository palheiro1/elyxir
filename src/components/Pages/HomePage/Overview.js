import { Box, Stack } from '@chakra-ui/react';
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
                */}
                <Box>
                    <News />
                </Box>
            </Stack>
        </Box>
    );
};

export default Overview;
