import { Image, Stack, Text } from '@chakra-ui/react';

const GemCard = ({ hover }) => {
    return (
        <Stack direction={'row'} spacing={4} align="center">
            <Image maxW="75px" src="/images/currency/gem.png" alt="Gem" />
            <Text fontWeight="bold" fontSize="2xl">
                {hover ? 'Delete order' : 'GEM'}
            </Text>
        </Stack>
    );
};

export default GemCard;
