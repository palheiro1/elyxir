import { Image, Stack, Text } from '@chakra-ui/react';

const ManaCard = ({ hover = false }) => {
    return (
        <Stack direction={'row'} spacing={4} align="center">
            <Image maxW="75px" src="/images/currency/mana.png" alt="MANA" />
            <Text fontWeight="bold" fontSize="2xl">
                {hover ? 'DELETE' : 'MANA'}
            </Text>
        </Stack>
    );
};

export default ManaCard;
