import { Box, Button, Center, Code, Heading, Spinner, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { MythicalProvider } from '@mythicalb/ardor-provider';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import NewsAirdrops from '../HomePage/NewsAirdrops';
import Elyxir from '../ElyxirPage';
import { GEMASSET, GIFTZASSET, MANAASSET, NQTDIVIDER, WETHASSET } from '../../../data/CONSTANTS';
import { fetchAllElyxirData } from '../../../redux/reducers/ElyxirReducer';
import { getBlockchainBlocks } from '../../../redux/reducers/BlockchainReducer';
import { fetchItems } from '../../../redux/reducers/ItemsReducer';
import { getAccountAssets } from '../../../services/Ardor/ardorInterface';

const DEFAULT_WALLET_HOST_ORIGIN =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://store.mythicalbeings.io';

const ELYXIR_PERMISSIONS = ['READ_ACCOUNT', 'READ_BALANCES', 'TX_TRANSFER_ASSET', 'TX_MESSAGE'];

const getOrigin = value => {
    try {
        return new URL(value).origin;
    } catch {
        return null;
    }
};

const isAllowedWalletHostOrigin = origin => {
    try {
        const { protocol, hostname, port } = new URL(origin);
        if (protocol === 'https:' && (hostname === 'mythicalbeings.io' || hostname.endsWith('.mythicalbeings.io'))) {
            return true;
        }
        return protocol === 'http:' && ['localhost', '127.0.0.1'].includes(hostname) && port === '3000';
    } catch {
        return false;
    }
};

const resolveWalletHostOrigin = () => {
    const configuredOrigin = getOrigin(process.env.REACT_APP_WALLET_HOST_ORIGIN);
    if (configuredOrigin) return configuredOrigin;

    const requestedOrigin = getOrigin(new URLSearchParams(window.location.search).get('walletHostOrigin'));
    if (requestedOrigin && isAllowedWalletHostOrigin(requestedOrigin)) return requestedOrigin;

    return DEFAULT_WALLET_HOST_ORIGIN;
};

const mapAssets = (accountAssets, balances) => {
    if (Array.isArray(accountAssets?.accountAssets)) return accountAssets.accountAssets;
    if (Array.isArray(balances?.assets)) {
        return balances.assets.map(asset => ({
            asset: asset.assetId,
            quantityQNT: asset.quantityQNT,
            decimals: asset.decimals ?? 0,
        }));
    }
    return [];
};

const getAssetQuantity = (assets, assetId, { formatted = false } = {}) => {
    const asset = assets.find(item => String(item.asset || item.assetId) === String(assetId));
    if (!asset) return 0;

    const quantity = Number(asset.quantityQNT || 0);
    if (!formatted) return quantity;

    const decimals = Number(asset.decimals || 0);
    return quantity / 10 ** decimals;
};

const EmbeddedStatus = ({ title, description, children }) => (
    <Center minH="100vh" bg="gray.950" color="white" p={6}>
        <Stack spacing={5} maxW="lg" textAlign="center" align="center">
            <Heading>{title}</Heading>
            <Text color="whiteAlpha.800">{description}</Text>
            {children}
        </Stack>
    </Center>
);

const PlayHubElyxirShell = ({ infoAccount, walletProvider, walletHostOrigin }) => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleGoToSection = section => {
        if (section === 10) {
            setTabIndex(1);
            return;
        }

        window.parent.postMessage(
            {
                type: 'MYTHICAL_WALLET_NAVIGATE',
                section,
            },
            walletHostOrigin
        );
    };

    return (
        <Box minH="100vh" bg="gray.950" color="white" px={{ base: 3, md: 6 }} py={14}>
            <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed" colorScheme="purple" isLazy>
                <TabList>
                    <Tab>Airdrops</Tab>
                    <Tab>Alchemy</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px={0}>
                        <NewsAirdrops goToSection={handleGoToSection} />
                    </TabPanel>
                    <TabPanel px={0}>
                        <Elyxir infoAccount={infoAccount} walletProvider={walletProvider} embedded />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

const ElyxirEmbeddedPage = () => {
    const dispatch = useDispatch();
    const providerRef = useRef(null);
    const [status, setStatus] = useState('connecting');
    const [error, setError] = useState(null);
    const [infoAccount, setInfoAccount] = useState(null);

    const walletHostOrigin = resolveWalletHostOrigin();
    const isFramed = window.parent !== window;

    const provider = useMemo(() => {
        if (!isFramed) return null;
        if (!providerRef.current) providerRef.current = new MythicalProvider(walletHostOrigin);
        return providerRef.current;
    }, [isFramed, walletHostOrigin]);

    useEffect(() => {
        if (!provider) return undefined;

        let cancelled = false;

        const connect = async () => {
            try {
                setStatus('connecting');
                setError(null);

                const session = await provider.connect({
                    appName: 'Elyxir',
                    appIconUrl: `${window.location.origin}/images/logos/ElyxirColor.png`,
                    permissions: ELYXIR_PERMISSIONS,
                });

                const [balances, accountAssets] = await Promise.all([
                    provider.getBalances().catch(() => null),
                    getAccountAssets(session.accountRS).catch(() => null),
                    dispatch(fetchItems({ accountRs: session.accountRS })),
                    dispatch(fetchAllElyxirData()),
                    dispatch(getBlockchainBlocks()),
                ]);

                if (cancelled) return;

                const assets = mapAssets(accountAssets, balances);

                setInfoAccount({
                    isEmbedded: true,
                    token: null,
                    accountRs: session.accountRS,
                    publicKey: session.publicKey,
                    name: session.displayName || 'Wallet account',
                    IGNISBalance: Number(balances?.ignisNQT || 0) / NQTDIVIDER,
                    GIFTZBalance: getAssetQuantity(assets, GIFTZASSET),
                    GEMBalance: getAssetQuantity(assets, GEMASSET, { formatted: true }),
                    WETHBalance: getAssetQuantity(assets, WETHASSET, { formatted: true }),
                    MANABalance: getAssetQuantity(assets, MANAASSET, { formatted: true }),
                    assets,
                    transactions: [],
                    dividends: [],
                    unconfirmedTxs: [],
                    currentAsks: [],
                    currentBids: [],
                    trades: [],
                });
                setStatus('ready');
            } catch (err) {
                if (cancelled) return;
                console.error('Elyxir embedded connect error:', err);
                setError(err);
                setStatus('error');
            }
        };

        connect();

        const blockInterval = setInterval(() => {
            dispatch(getBlockchainBlocks());
        }, 15000);

        return () => {
            cancelled = true;
            clearInterval(blockInterval);
            provider.destroy();
            providerRef.current = null;
        };
    }, [dispatch, provider]);

    if (!isFramed) {
        return (
            <EmbeddedStatus
                title="Open Elyxir from Play Hub"
                description="This embedded Elyxir build connects to the Mythical Beings Wallet host and must be launched from Play Hub."
            />
        );
    }

    if (status === 'connecting') {
        return (
            <EmbeddedStatus title="Connecting to wallet" description={`Waiting for ${walletHostOrigin}.`}>
                <Spinner color="purple.300" size="xl" thickness="4px" />
            </EmbeddedStatus>
        );
    }

    if (status === 'error') {
        return (
            <EmbeddedStatus
                title="Wallet connection failed"
                description="Elyxir could not connect to the Wallet host. Check that the wallet is unlocked and this origin is allowed."
            >
                <Code whiteSpace="pre-wrap" colorScheme="red">
                    {error?.message || 'Unknown error'}
                </Code>
                <Button colorScheme="purple" onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </EmbeddedStatus>
        );
    }

    return (
        <Box minH="100vh" bg="gray.900">
            {infoAccount && (
                <PlayHubElyxirShell
                    infoAccount={infoAccount}
                    walletProvider={provider}
                    walletHostOrigin={walletHostOrigin}
                />
            )}
        </Box>
    );
};

export default ElyxirEmbeddedPage;
