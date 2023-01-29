import { Box, Center } from '@chakra-ui/react';
import { useState } from 'react';
import SectionSwitch from './SectionSwitch';
import SwapToArdor from './SwapToArdor';
import SwapToPolygon from './SwapToPolygon';

const Bridge = ({ infoAccount, cards }) => {
    const [option, setOption] = useState(0);

    return (
        <>
            <SectionSwitch option={option} setOption={setOption} />

            <Center>
                <Box maxW="50%">
                    {option === 0 && <SwapToPolygon infoAccount={infoAccount} cards={cards} />}
                    {option === 1 && <SwapToArdor infoAccount={infoAccount} cards={cards} />}
                </Box>
            </Center>
        </>
    );
};

export default Bridge;
