import { Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { RARITY_COLORS } from "../../data/CONSTANTS";

const CardBadges = ({ rarity, continent, size = "md" }) => {

    const badgeColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.300');

    return (
        <Stack direction={'row'} spacing={1}>
            <Text
                textAlign="center"
                fontSize={size}
                bgGradient={RARITY_COLORS[rarity]}
                rounded="lg"
                color="black"
                px={2}>
                {rarity}
            </Text>
            <Text fontSize={size} bgColor={badgeColor} rounded="lg" color="white" px={2} textAlign="center">
                {continent}
            </Text>
        </Stack>
    );
};

export default CardBadges;
