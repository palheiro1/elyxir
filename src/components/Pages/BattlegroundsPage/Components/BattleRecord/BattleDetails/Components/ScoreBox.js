import { Box, Text } from '@chakra-ui/react';

/**
 * @name ScoreBox
 * @description Renders a diamond-shaped score box displaying the given value. Highlights the score visually if it belongs to the winner.
 * @param {Object} props - Component props.
 * @param {number|string} props.value - The score value to be displayed.
 * @param {boolean} props.isWinner - Indicates whether this score belongs to the winning side.
 * @returns {JSX.Element} A stylized score box with a rotated design.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const ScoreBox = ({ value, isWinner }) => (
    <Box
        right={5}
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
        _after={{
            content: '""',
            display: 'block',
            paddingBottom: '100%',
        }}>
        <Text
            fontFamily="Chelsea Market"
            color={isWinner ? '#000' : '#D597B2'}
            fontSize="xl"
            transform="rotate(-45deg)"
            position="absolute">
            {value}
        </Text>
    </Box>
);

export default ScoreBox;
