import { TriangleUpIcon } from '@chakra-ui/icons';
import { Box, Image, Stack, Text, Tooltip } from '@chakra-ui/react';

/**
 * @name CapturedCard
 * @description Displays information about a card captured or obtained during the battle,
 * adjusting the label based on whether the user was defending and if they won or lost.
 * Shows a tooltip with a card preview image.
 * @param {Object} props - Component props.
 * @param {Object|null} props.capturedCard - The card object containing image URL and name.
 * @param {boolean} props.isUserDefending - Whether the current user was the defender.
 * @param {boolean} props.isDefenderWin - Whether the defender won the battle.
 * @returns {JSX.Element} A label indicating the captured/obtained card with a tooltip showing the card image.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CapturedCard = ({ capturedCard, isUserDefending, isDefenderWin }) => {
    const labelText = isUserDefending === isDefenderWin ? 'OBTAINED CARD:' : 'CAPTURED CARD:';

    return (
        <Stack direction={'row'} spacing={1} alignItems={'end'} mx={'auto'} w={'30%'} h={'100%'}>
            <Tooltip
                label={
                    <Box>
                        <Image src={capturedCard?.cardImgUrl} alt={capturedCard?.name} w="200px" />
                    </Box>
                }
                aria-label={capturedCard?.name}
                placement="top"
                hasArrow>
                <Stack direction={'row'} mx={'auto'} my={'auto'}>
                    <Text color={'#000'} fontSize={'large'}>
                        {labelText}
                    </Text>
                    <TriangleUpIcon color={'#000'} my={'auto'} />
                </Stack>
            </Tooltip>
        </Stack>
    );
};

export default CapturedCard;
