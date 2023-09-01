import { Image, Stack, Text } from '@chakra-ui/react';

const IgnisCard = ({ hover = false }) => {
    return (
        <Stack direction={'row'} spacing={4} align="center">
            <Image maxW="75px" src="/images/currency/ignis.png" alt="Ignis" />
            <Text fontWeight="bold" fontSize="2xl" minW="100%">
                {hover ? 'DELETE' : 'IGNIS'}
            </Text>
        </Stack>
    );
};

export default IgnisCard;
