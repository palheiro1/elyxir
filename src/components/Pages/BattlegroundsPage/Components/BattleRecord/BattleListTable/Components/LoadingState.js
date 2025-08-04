import { Box, Spinner } from '@chakra-ui/react';

/**
 * @name LoadingState
 * @description Renders a centered loading spinner for use while data is being fetched or a component is waiting for asynchronous content.
 * It is absolutely positioned in the center of its container and styled for visibility on dark backgrounds.
 * @returns {JSX.Element} A centered Chakra UI Spinner component wrapped in a Box.
 * @example
 * {isLoading && <LoadingState />}
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const LoadingState = () => (
    <Box
        h="100%"
        position="absolute"
        color="#FFF"
        top="50%"
        left="50%"
        w="100%"
        textAlign="center"
        transform="translate(-50%, -50%)">
        <Spinner color="#FFF" w={20} h={20} />
    </Box>
);

export default LoadingState;
