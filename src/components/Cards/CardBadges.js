import { Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { RARITY_COLORS } from '../../data/CONSTANTS';

const CardBadges = ({ rarity, continent, size = 'md' }) => {
    const continentColor = useColorModeValue('linear-gradient(45deg, #788188, #4a4c4d) 1', 'linear-gradient(45deg, #788188, #4a4c4d) 1');

    return (
        <Stack direction={{ base: 'column', md: 'row' }} spacing={1}>
            <Text
                px={2}
                w={{ base: '6rem', md: 'auto' }}
                h={{ base: '1.5rem', md: 'auto' }}
                textAlign="center"
                fontSize={size}
                bgGradient={RARITY_COLORS[rarity]}
                rounded="lg"
                color="black">
                {rarity}
            </Text>
            <Text
                px={3}
                fontSize={size}
                w={{ base: '6rem', md: 'auto' }}
                h={{ base: '1.5rem', md: 'auto' }}
                bgGradient={continentColor}
                rounded="lg"
                color="white"
                textAlign="center">
                {continent}
            </Text>
        </Stack>
    );
};

export default CardBadges;
