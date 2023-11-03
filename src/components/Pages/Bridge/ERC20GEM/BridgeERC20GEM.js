import { useState } from 'react';
import SectionSwitch from './SectionSwitch';
import SwapToArdor from './SwapToArdor';
import SwapToPolygon from './SwapToPolygon';
import { Box, Center } from '@chakra-ui/react';

const BridgeERC20GEM = ({ infoAccount, swapAddresses, gemCards }) => {
    const [option, setOption] = useState(0);

    return (
        <>
            <SectionSwitch option={option} setOption={setOption} />

            <Center>
                <Box maxW="50%">
                    {option === 0 && <SwapToArdor infoAccount={infoAccount} ethAddress={swapAddresses.eth} />}
                    {option === 1 && <SwapToPolygon infoAccount={infoAccount} ardorAddress={swapAddresses.ardor} gemCards={gemCards} />}
                </Box>
            </Center>
        </>
    );
};

export default BridgeERC20GEM;
