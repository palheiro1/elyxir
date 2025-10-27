import { Box } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import ElyxirMarket from './ElyxirMarket';

/**
 * @name Market
 * @description Elyxir-only Market page
 * @returns {JSX.Element} - JSX element
 */
const Market = ({ infoAccount }) => {
    const { items } = useSelector(state => state.items);

    return (
        <Box maxW={{ base: '100%', lg: '70vw', xl: '77.5vw', '2xl': '100%' }}>
            <ElyxirMarket items={items} infoAccount={infoAccount} />
        </Box>
    );
};

export default Market;
