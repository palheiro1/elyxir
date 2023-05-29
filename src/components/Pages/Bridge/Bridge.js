import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getEthDepositAddressFor1155, getEthDepositAddressFor20, getPegAddressesFor1155, getPegAddressesFor20 } from '../../../services/Ardor/ardorInterface';
import BridgeERC1155 from './ERC1155/BridgeERC1155';
import BridgeSelector from './BridgeSelector';
import BridgeERC20 from './ERC20/BridgeERC20';

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
    const [swapAddresses, setSwapAddresses] = useState({
        ERC20: { eth: '', ardor: '' },
        ERC1155: { eth: '', ardor: '' },
        isLoaded: false,
    });
    const [needReload, setNeedReload] = useState(true); // Flag to reload the page [true -> reload
    const [isLoading, setIsLoading] = useState(false);
    const [bridgeType, setBridgeType] = useState(); // ERC20 or ERC1155

    useEffect(() => {
        const getSwapAddresses = async () => {
            setIsLoading(true);
            setNeedReload(false);
            try {
                const [ethAddress, { ardorBlockedAccount }, eth20Address, { ardorBlockedAccount:ardorBlockedAccount20 }] = await Promise.all([
                    getEthDepositAddressFor1155(infoAccount.accountRs),
                    getPegAddressesFor1155(),
                    getEthDepositAddressFor20(infoAccount.accountRs),
                    getPegAddressesFor20(),
                ]);
                console.log('🚀 ~ file: Bridge.js:31 ~ getSwapAddresses ~ ethAddress:', ethAddress, ardorBlockedAccount, eth20Address);
                setSwapAddresses({
                    ERC20: {
                        eth: eth20Address,
                        ardor: ardorBlockedAccount20,
                    },
                    ERC1155: {
                        eth: ethAddress,
                        ardor: ardorBlockedAccount,
                    },
                    isLoaded: true,
                });
            } catch (error) {
                console.error(error);
                // Manejar el error de forma adecuada
            }
            setIsLoading(false);
        };

        needReload && !swapAddresses.isLoaded && !isLoading && getSwapAddresses();
    }, [infoAccount.accountRs, swapAddresses.isLoaded, isLoading, needReload]);

    return (
        <Box>
            {bridgeType === undefined && <BridgeSelector setBridgeType={setBridgeType} />}
            {bridgeType === 'ERC20' && <BridgeERC20 infoAccount={infoAccount} swapAddresses={swapAddresses?.ERC20} />}
            {bridgeType === 'ERC1155' && (
                <BridgeERC1155 infoAccount={infoAccount} swapAddresses={swapAddresses?.ERC1155} cards={cards} />
            )}
        </Box>
    );
};

export default Bridge;
