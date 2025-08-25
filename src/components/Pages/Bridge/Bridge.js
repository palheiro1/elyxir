import { Box, Heading, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
    getEthDepositAddressFor1155,
    getEthDepositAddressFor20,
    getPegAddressesFor1155,
    getPegAddressesFor20,
} from '../../../services/Ardor/ardorInterface';
import BridgeERC1155 from './ERC1155/BridgeERC1155';
import BridgeERC1155GIFTZ from './GIFTZ/BridgeERC1155GIFTZ';
import BridgeSelector from './BridgeSelector';
import BridgeERC20 from './ERC20wETH/BridgeERC20';
import OldBridge from './OldBridge/OldBridge';
import BridgeERC20GEM from './ERC20GEM/BridgeERC20GEM';
import BridgeERC20Mana from './ERC20Mana/BridgeERC20';

/**
 * @name Bridge
 * @description This component is the bridge page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Object} infoAccount - Account info
 * @param {Array} cards - Cards
 * @returns {JSX.Element} - JSX element
 */
const Bridge = ({ infoAccount, cards, gemCards, giftzCards, wethCards, manaCards, selectedBridgeType }) => {
    const [swapAddresses, setSwapAddresses] = useState({
        OLD_BRIDGE: { eth: '' },
        ERC20: { eth: '', ardor: '' },
        ERC1155: { eth: '', ardor: '' },
        isLoaded: false,
    });
    const [needReload, setNeedReload] = useState(true); // Flag to reload the page [true -> reload
    const [isLoading, setIsLoading] = useState(false);
    const [bridgeType, setBridgeType] = useState(selectedBridgeType); // ERC20 or ERC1155
    const [isError, setIsError] = useState(false); // Flag to show error message

    useEffect(() => {
        const getSwapAddresses = async () => {
            setIsLoading(true);
            setNeedReload(false);
            try {
                const [
                    { ardorBlockedAccount: ardorBlockedAccount1155 },
                    ethAddress1155Bridge,

                    { ardorBlockedAccount: ardorBlockedAccount20 },
                    ethAddress20Bridge,
                ] = await Promise.all([
                    getPegAddressesFor1155(),
                    getEthDepositAddressFor1155(infoAccount.accountRs),

                    getPegAddressesFor20(),
                    getEthDepositAddressFor20(infoAccount.accountRs),
                ]);

                if (!ethAddress20Bridge || !ethAddress1155Bridge) {
                    setIsError(true);
                    return;
                }
                setSwapAddresses({
                    ERC1155: {
                        eth: ethAddress1155Bridge,
                        ardor: ardorBlockedAccount1155,
                    },
                    ERC20: {
                        eth: ethAddress20Bridge,
                        ardor: ardorBlockedAccount20,
                    },
                    isLoaded: true,
                });
            } catch (error) {
                console.error('🚀 ~ file: Bridge.js:73 ~ getSwapAddresses ~ error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        needReload && !swapAddresses.isLoaded && !isLoading && getSwapAddresses();
    }, [infoAccount.accountRs, swapAddresses.isLoaded, isLoading, needReload]);

    return !isError ? (
        <Box>
            {!bridgeType && <BridgeSelector setBridgeType={setBridgeType} />}
            {bridgeType === 'ERC20wETH' && (
                <BridgeERC20 infoAccount={infoAccount} swapAddresses={swapAddresses?.ERC20} wethCards={wethCards} />
            )}
            {bridgeType === 'ERC20Mana' && (
                <BridgeERC20Mana infoAccount={infoAccount} swapAddresses={swapAddresses?.ERC20} manaCards={manaCards} />
            )}
            {bridgeType === 'ERC20GEM' && (
                <BridgeERC20GEM infoAccount={infoAccount} swapAddresses={swapAddresses?.ERC20} gemCards={gemCards} />
            )}
            {bridgeType === 'ERC1155' && (
                <BridgeERC1155 infoAccount={infoAccount} swapAddresses={swapAddresses?.ERC1155} cards={cards} />
            )}
            {bridgeType === 'ERC1155GIFTZ' && (
                <BridgeERC1155GIFTZ
                    infoAccount={infoAccount}
                    swapAddresses={swapAddresses?.ERC1155}
                    giftzCards={giftzCards}
                />
            )}
            {bridgeType === 'OLD' && <OldBridge infoAccount={infoAccount} swapAddresses={swapAddresses?.OLD_BRIDGE} />}
        </Box>
    ) : (
        <Box>
            <Heading textAlign={'center'}>Unregistered account</Heading>
            <Text textAlign={'center'} mt={3}>
                The wallet address cannot be generated because your pubkey is not yet registered on the blockchain.
                <br /> Use the Faucet on Account to generate your first transaction (and earn 5 ignis).
            </Text>
        </Box>
    );
};

export default Bridge;
