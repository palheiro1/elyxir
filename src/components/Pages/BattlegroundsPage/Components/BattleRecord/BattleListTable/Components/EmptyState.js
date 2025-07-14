import { Box } from '@chakra-ui/react';

/**
 * @name EmptyState
 * @description Displays a centered message indicating that no battles have been recorded yet. Used when the battle list is empty. Styled with custom font and absolute positioning for clarity and consistency.
 * @returns {JSX.Element} A centered Chakra UI Box containing a message for the empty state.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const EmptyState = () => (
    <Box
        h="100%"
        position="absolute"
        color="#FFF"
        top="50%"
        left="50%"
        w="100%"
        fontSize="lg"
        fontFamily="Chelsea Market, System"
        textAlign="center"
        transform="translate(-50%, -50%)">
        You have not yet fought any battle
    </Box>
);

export default EmptyState;
