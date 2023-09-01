import { Image, Stack, Text } from '@chakra-ui/react';

const GIFTZCard = ({ hover = false }) => {
    return (
        <Stack direction={'row'} spacing={4} align="center" minW="100%">
            <Image maxW="75px" src="/images/currency/giftz.png" alt="Giftz" />
            <Text fontWeight="bold" fontSize="2xl">
                {hover ? 'DELETE' : 'GIFTZ'}
            </Text>
        </Stack>
    );
};

export default GIFTZCard;
