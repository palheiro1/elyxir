import { Box, Center } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getEthDepositAddress, getPegAddresses } from '../../../services/Ardor/ardorInterface';
import SectionSwitch from './SectionSwitch';
import SwapToArdor from './SwapToArdor';
import SwapToPolygon from './SwapToPolygon';

const Bridge = ({ infoAccount, cards }) => {
    const [option, setOption] = useState(0);
    const [swapAddresses, setSwapAddresses] = useState({ eth: '', ardor: '', isLoaded: false });

    useEffect(() => {
        const getSwapAccounts = async () => {
            const ethAddress = await getEthDepositAddress(infoAccount.accountRs);
            const ardorAddress = await getPegAddresses();
            setSwapAddresses({ eth: ethAddress, ardor: ardorAddress.ardorBlockedAccount, isLoaded: true });
        };

        !swapAddresses.isLoaded && getSwapAccounts();
    }, [infoAccount.accountRs, swapAddresses.isLoaded]);

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
