import { Box, Stack } from '@chakra-ui/react';
import JackpotWidget from '../../../JackpotWidget/JackpotWidget';
import Buttons from './Buttons';

const HowToPlay = ({ blockchainStatus }) => {
    return (
        <Box py={6}>
            <Buttons />

            <Stack
                gap={{ base: 0, lg: 8, xl: 16 }}
                direction={{ base: 'column', lg: 'row' }}
                align={{ base: 'center', lg: 'flex-end' }}
                justify={'center'}>
                <Box my={4} pl={{ base: 6, xl: 0 }} mr={{ base: 0, xl: 8 }} />
                <Box pl={8}>
                    <JackpotWidget blockchainStatus={blockchainStatus} cStyle={1} />
                </Box>
            </Stack>
        </Box>
    );
};

export default HowToPlay;
