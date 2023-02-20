import { Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { RARITY_COLORS } from '../../data/CONSTANTS';

const CardBadges = ({ rarity, continent, size = 'md' }) => {
    const badgeColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.300');

    return (
        <Stack direction={{ base: 'column', md: 'row' }} spacing={1}>
            <Text
                px={2}
                w={{ base: '6rem', md: 'auto' }}
                h={{ base: '1rem', md: 'auto' }}
                textAlign="center"
                fontSize={size}
                bgGradient={RARITY_COLORS[rarity]}
                rounded="lg"
                color="black">
                {rarity}
            </Text>
            <Text
                px={2}
                fontSize={size}
                w={{ base: '6rem', md: 'auto' }}
                h={{ base: '1rem', md: 'auto' }}
                bgColor={badgeColor}
                rounded="lg"
                color="white"
                textAlign="center">
                {continent}
            </Text>
        </Stack>
    );
};

export default CardBadges;
