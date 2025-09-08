import { Box, Heading, Text } from '@chakra-ui/react';

/**
 * @name Bridge
 * @description Elyxir-only Bridge page (placeholder)
 * @returns {JSX.Element} - JSX element
 */
const Bridge = ({ infoAccount }) => {
    // For Elyxir-only, show a placeholder for item bridging
    return (
        <Box>
            <Heading textAlign={'center'}>Elyxir Item Bridge</Heading>
            <Text textAlign={'center'} mt={3}>
                The Elyxir bridge will allow you to transfer your Elyxir items between supported chains.<br />
                This feature is coming soon!
            </Text>
        </Box>
    );
};

export default Bridge;
