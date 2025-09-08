import { Box } from '@chakra-ui/react';
import ElyxirMarket from '../ElyxirPage/ElyxirMarket';

/**
 * @name Market
 * @description Elyxir-only Market page
 * @returns {JSX.Element} - JSX element
 */
const Market = ({ infoAccount }) => {
    // For Elyxir-only, get items from infoAccount or pass empty array
    const items = infoAccount?.elyxirItems || [];
    return (
        <Box maxW={{ base: '100%', lg: '70vw', xl: '77.5vw', '2xl': '100%' }}>
            <ElyxirMarket items={items} infoAccount={infoAccount} />
        </Box>
    );
};

export default Market;
