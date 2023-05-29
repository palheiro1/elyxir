import { useState } from 'react';

import { Box, Center } from '@chakra-ui/react';

import SectionSwitch from './SectionSwitch';
import SwapToPolygon from './SwapToPolygon';
import SwapToArdor from './SwapToArdor';

const   BridgeERC1155 = ({ infoAccount, swapAddresses, cards }) => {
    console.log("🚀 ~ file: BridgeERC1155.js:10 ~ BridgeERC1155 ~ swapAddresses:", swapAddresses)
    const [option, setOption] = useState(0);

    return (
        <>
            <SectionSwitch option={option} setOption={setOption} />

            <Center>
                <Box maxW="50%">
                    {option === 0 && (
                        <SwapToPolygon infoAccount={infoAccount} ardorAddress={swapAddresses.ardor} cards={cards} />
                    )}
                    {option === 1 && <SwapToArdor infoAccount={infoAccount} ethAddress={swapAddresses.eth} />}
                </Box>
            </Center>
        </>
    );
};

export default BridgeERC1155;
