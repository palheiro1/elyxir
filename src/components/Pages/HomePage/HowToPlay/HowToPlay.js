import { Box, Stack } from '@chakra-ui/react';
import BountyWidget from '../../../BountyWidget/BountyWidget';
import Buttons from './Buttons';
import { IS_BOUNTY_ENABLED } from '../../../../data/CONSTANTS';

const HowToPlay = () => {
    return (
        <Box py={6}>
            <Buttons />

            {IS_BOUNTY_ENABLED && (
                <Stack
                    gap={{ base: 0, xl: 8, '2xl': 16 }}
                    direction={{ base: 'column', lg: 'row' }}
                    align={{ base: 'center', lg: 'flex-end' }}
                    justify={'center'}>
                    {/* <Box my={4} pl={{ base: 0, xl: 0 }} mr={{ base: 0, xl: 8 }} /> */}
                    <Box px={{ base: 0, xl: 2 }}>
                        <BountyWidget cStyle={1} />
                    </Box>
                </Stack>
            )}
        </Box>
    );
};

export default HowToPlay;
