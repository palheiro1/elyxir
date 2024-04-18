import { Box, Stack } from '@chakra-ui/react';
import BountyWidget from '../../../BountyWidget/BountyWidget';
import Buttons from './Buttons';

const HowToPlay = () => {
    return (
        <Box py={6}>
            <Buttons />

            <Stack
                gap={{ base: 0, lg: 8, xl: 16 }}
                direction={{ base: 'column', lg: 'row' }}
                align={{ base: 'center', lg: 'flex-end' }}
                justify={'center'}>
                <Box my={4} pl={{ base: 6, xl: 0 }} mr={{ base: 0, xl: 8 }} />
                <Box pl={{ base: 0, lg: 8 }}>
                    <BountyWidget cStyle={1} />
                </Box>
            </Stack>
        </Box>
    );
};

export default HowToPlay;
