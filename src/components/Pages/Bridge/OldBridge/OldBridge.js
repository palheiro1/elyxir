import { Box, Center } from '@chakra-ui/react';
import SwapToArdor from './SwapToArdor';

const OldBridge = ({ infoAccount, swapAddresses }) => {
    return (
        <Center>
            <Box maxW="50%">
                <SwapToArdor infoAccount={infoAccount} ethAddress={swapAddresses.eth} />
            </Box>
        </Center>
    );
};

export default OldBridge;
