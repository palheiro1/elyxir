import { Box, Text } from '@chakra-ui/react';

/**
 * @name ValueBox
 * @description Renders a box displaying the value of a card in a rotated square format.
 * Includes conditional styling to highlight the winner.
 * @param {Object} props
 * @param {number} props.value - The value to display inside the box.
 * @param {boolean} props.isWinner - Whether this box represents the winning card.
 * @return {JSX.Element} A styled box with the card value displayed.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const ValueBox = ({ value, isWinner }) => (
    <Box
        width="8"
        height="8"
        m="auto"
        bg={isWinner ? '#FFF' : 'transparent'}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        border="2px solid #D597B2"
        borderRadius={5}
        transform="rotate(45deg)"
        _after={{ content: '""', display: 'block', paddingBottom: '100%' }}>
        <Text color={isWinner ? '#000' : '#D597B2'} fontSize="xl" transform="rotate(-45deg)" position="absolute">
            {value}
        </Text>
    </Box>
);

export default ValueBox;
