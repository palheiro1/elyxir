import { Box, Center } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getEthDepositAddress, getPegAddresses } from '../../../services/Ardor/ardorInterface';
import SectionSwitch from './SectionSwitch';
import SwapToArdor from './SwapToArdor';
import SwapToPolygon from './SwapToPolygon';

/**
 * @name Bridge
 * @description This component is the bridge page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Object} infoAccount - Account info
 * @param {Array} cards - Cards
 * @returns {JSX.Element} - JSX element
 */
const Bridge = ({ infoAccount, cards }) => {
    const [option, setOption] = useState(0);
    const [swapAddresses, setSwapAddresses] = useState({ eth: '', ardor: '', isLoaded: false });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getSwapAddresses = async () => {
            setIsLoading(true);
            try {
                const [ethAddress, { ardorBlockedAccount }] = await Promise.all([
                    getEthDepositAddress(infoAccount.accountRs),
                    getPegAddresses(),
                ]);
                setSwapAddresses({ eth: ethAddress, ardor: ardorBlockedAccount, isLoaded: true });
            } catch (error) {
                console.error(error);
                // Manejar el error de forma adecuada
            }
            setIsLoading(false);
        };

        !swapAddresses.isLoaded && !isLoading && getSwapAddresses();
    }, [infoAccount.accountRs, swapAddresses.isLoaded, isLoading]);

    return (
        <>
            <SectionSwitch option={option} setOption={setOption} />

            <Center>
                <Box maxW="50%">
                    {option === 0 && (
                        <SwapToPolygon infoAccount={infoAccount} ardorAddress={swapAddresses.ardor} cards={cards} />
                    )}
                    {option === 1 && <SwapToArdor infoAccount={infoAccount} ethAddress={swapAddresses.eth} />}
                </Box>
            </Center>
        </>
    );
};

export default Bridge;
