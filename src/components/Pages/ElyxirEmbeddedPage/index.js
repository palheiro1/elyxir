import { Box, Button, Center, Code, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import { MythicalProvider } from '@mythicalb/ardor-provider';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import PlayHubElyxirShell from '../ElyxirPage/PlayHubShell';
import { GEMASSET, GIFTZASSET, MANAASSET, NQTDIVIDER, WETHASSET } from '../../../data/CONSTANTS';
import { fetchAllElyxirData } from '../../../redux/reducers/ElyxirReducer';
import { getBlockchainBlocks } from '../../../redux/reducers/BlockchainReducer';
import { fetchItems } from '../../../redux/reducers/ItemsReducer';
import { getAccountAssets } from '../../../services/Ardor/ardorInterface';

const DEFAULT_WALLET_HOST_ORIGIN =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://store.mythicalbeings.io';

const ELYXIR_PERMISSIONS = ['READ_ACCOUNT', 'READ_BALANCES', 'TX_TRANSFER_ASSET', 'TX_MESSAGE'];
const EMBEDDED_REFRESH_MS = 15000;

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

const ElyxirEmbeddedPage = () => {
    const dispatch = useDispatch();
    const providerRef = useRef(null);
    const [status, setStatus] = useState('connecting');
    const [error, setError] = useState(null);
    const [infoAccount, setInfoAccount] = useState(null);

    const query = new URLSearchParams(window.location.search);
    const walletHostOrigin = resolveWalletHostOrigin();
    const isMockPlayHub = process.env.NODE_ENV === 'development' && query.get('mock') === '1';
    const isFramed = window.parent !== window || isMockPlayHub;

    const provider = useMemo(() => {
        if (isMockPlayHub) return null;
        if (!isFramed) return null;
        if (!providerRef.current) providerRef.current = new MythicalProvider(walletHostOrigin);
        return providerRef.current;
    }, [isFramed, isMockPlayHub, walletHostOrigin]);

    const loadEmbeddedData = useCallback(async ({ session, balances, accountAssets }) => {
        const assets = mapAssets(accountAssets, balances);
        const embeddedInfoAccount = {
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
        };

        await Promise.all([
            dispatch(fetchItems({ accountRs: session.accountRS })),
            dispatch(fetchAllElyxirData({ infoAccount: embeddedInfoAccount })),
            dispatch(getBlockchainBlocks()),
        ]);

        return embeddedInfoAccount;
    }, [dispatch]);

    useEffect(() => {
        if (isMockPlayHub) {
            let cancelled = false;
            const mockInfoAccount = {
                isEmbedded: true,
                token: null,
                accountRs: 'ARDOR-CLUN-N4AJ-ZQWK-GD74N',
                publicKey: '',
                name: 'CLUN',
                IGNISBalance: 21,
                GIFTZBalance: 0,
                GEMBalance: 274,
                WETHBalance: 0,
                MANABalance: 0,
                assets: [],
                transactions: [],
                dividends: [],
                unconfirmedTxs: [],
                currentAsks: [],
                currentBids: [],
                trades: [],
            };

            const loadMock = async () => {
                try {
                    setStatus('connecting');
                    await Promise.all([
                        dispatch(fetchItems({ accountRs: mockInfoAccount.accountRs })).catch(() => null),
                        dispatch(fetchAllElyxirData({ infoAccount: mockInfoAccount })),
                        dispatch(getBlockchainBlocks()),
                    ]);
                    if (cancelled) return;
                    setInfoAccount(mockInfoAccount);
                    setStatus('ready');
                } catch (err) {
                    if (cancelled) return;
                    setError(err);
                    setStatus('error');
                }
            };

            loadMock();

            const mockRefreshInterval = setInterval(() => {
                Promise.all([
                    dispatch(fetchItems({ accountRs: mockInfoAccount.accountRs })).catch(() => null),
                    dispatch(fetchAllElyxirData({ infoAccount: mockInfoAccount })).catch(() => null),
                    dispatch(getBlockchainBlocks()).catch(() => null),
                ]).catch(() => null);
            }, EMBEDDED_REFRESH_MS);

            return () => {
                cancelled = true;
                clearInterval(mockRefreshInterval);
            };
        }

        if (!provider) return undefined;

        let cancelled = false;
        let refreshInterval = null;
        let isRefreshing = false;
        let connectedSession = null;

        const refreshData = async ({ markReady = false } = {}) => {
            if (!connectedSession || isRefreshing) return;
            isRefreshing = true;

            try {
                const [balances, accountAssets] = await Promise.all([
                    provider.getBalances().catch(() => null),
                    getAccountAssets(connectedSession.accountRS).catch(() => null),
                ]);

                if (cancelled) return;

                const embeddedInfoAccount = await loadEmbeddedData({
                    session: connectedSession,
                    balances,
                    accountAssets,
                });

                if (cancelled) return;

                setInfoAccount(embeddedInfoAccount);
                if (markReady) setStatus('ready');
            } finally {
                isRefreshing = false;
            }
        };

        const connect = async () => {
            try {
                setStatus('connecting');
                setError(null);

                const session = await provider.connect({
                    appName: 'Elyxir',
                    appIconUrl: `${window.location.origin}/images/logos/ElyxirColor.png`,
                    permissions: ELYXIR_PERMISSIONS,
                });

                if (cancelled) return;
                connectedSession = session;
                await refreshData({ markReady: true });
                refreshInterval = setInterval(() => {
                    refreshData().catch(err => console.error('Elyxir embedded refresh error:', err));
                }, EMBEDDED_REFRESH_MS);
            } catch (err) {
                if (cancelled) return;
                console.error('Elyxir embedded connect error:', err);
                setError(err);
                setStatus('error');
            }
        };

        connect();

        return () => {
            cancelled = true;
            if (refreshInterval) clearInterval(refreshInterval);
            provider.destroy();
            providerRef.current = null;
        };
    }, [dispatch, isMockPlayHub, loadEmbeddedData, provider]);

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
