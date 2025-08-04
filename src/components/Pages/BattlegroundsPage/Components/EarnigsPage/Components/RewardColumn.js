import { GridItem, Image, Stack, Text } from '@chakra-ui/react';

/**
 * @name RewardColumn
 * @description Component that renders a grid cell displaying a reward label alongside its image.
 * Used within leaderboard or reward UI layouts.
 * @param {Object} props - Component props.
 * @param {string} props.label - Text label describing the reward.
 * @param {string} props.imageSrc - Image source URL representing the reward.
 * @param {boolean} props.isMobile - Determines responsive font sizing.
 * @returns {JSX.Element} Rendered Chakra UI GridItem containing the reward label and image.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const RewardColumn = ({ label, imageSrc, isMobile }) => (
    <GridItem colSpan={1} textAlign="center" my="auto">
        <Stack direction="row" w="fit-content" mx="auto">
            <Text fontFamily="Inter, System" my="auto" fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                {label}
            </Text>
            <Image src={imageSrc} boxSize="30px" />
        </Stack>
    </GridItem>
);

export default RewardColumn;
