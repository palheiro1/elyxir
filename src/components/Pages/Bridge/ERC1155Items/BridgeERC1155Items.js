import { useState } from 'react';

import { Box, Center } from '@chakra-ui/react';

import SectionSwitch from './SectionSwitch';
import SwapToPolygon from './SwapToPolygon';
import SwapToArdor from './SwapToArdor';

const BridgeERC1155Items = ({ infoAccount, swapAddresses, items = [] }) => {
    const [option, setOption] = useState(0);

    return (
        <>
            <SectionSwitch option={option} setOption={setOption} />

            <Center>
                <Box maxW="50%">
                    {option === 0 && (
                        <SwapToPolygon infoAccount={infoAccount} ardorAddress={swapAddresses.ardor} items={items} />
                    )}
                    {option === 1 && <SwapToArdor infoAccount={infoAccount} ethAddress={swapAddresses.eth} />}
                </Box>
            </Center>
        </>
    );
};

export default BridgeERC1155Items;
