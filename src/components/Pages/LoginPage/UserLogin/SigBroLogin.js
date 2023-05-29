import { useEffect, useState } from 'react';
import { Box, Center, Spinner, Stack, Text } from '@chakra-ui/react';
import { checkConexion, checkIfIsValid, createConexion } from '../../../../services/Sigbro/walletConnect';
import { v4 as uuid } from 'uuid';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

const SigBroLogin = ({ setInfoAccount }) => {
    const [actualUUID, setActualUUID] = useState(null);
    const [waitingForConnection, setWaitingForConnection] = useState(false);
    const navigate = useNavigate();

    const DEFAULT_ROUTE = 'https://dl.sigbro.com/auth/';
    const DEEP_LINK = `${DEFAULT_ROUTE}${actualUUID}/`;

    useEffect(() => {
        const getUUID = async () => {
            const auxUuid = uuid();
            setActualUUID(auxUuid);
            const auxConexion = await createConexion(auxUuid);
            if (auxConexion.result === 'ok') {
                setWaitingForConnection(true);
            }
        };
        getUUID();
    }, []);

    useEffect(() => {
        if (!waitingForConnection) return;

        const interval = setInterval(async () => {
            console.log('Checking connection...');
            const check = await checkConexion(actualUUID);

            if (check.result !== 'ok') return;

            const isValid = await checkIfIsValid(actualUUID, check.token);
            if (!isValid.valid) return;

            setInfoAccount({
                accountRs: check.accountRS,
                token: check.token,
                isSigBro: true,
                GEMSBalance: 0,
                IGNISBalance: 0,
                GIFTZBalance: 0,
                WETHBalance: 0,
            });
            setWaitingForConnection(false);
            navigate('/home');

            clearInterval(interval);
        }, 5000);

        return () => clearInterval(interval);
    }, [waitingForConnection, actualUUID, setInfoAccount, navigate]);

    return (
        <Stack spacing={3} pt={4}>
            <Text fontSize="sm" color="gray.500">
                Scan the QR code with SigBro app
            </Text>
            <Center>
                <Box my={2} maxW={64} w="100%" h={64}>
                    {waitingForConnection ? (
                        <>
                            <QRCode
                                size={256}
                                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                                viewBox={`0 0 256 256`}
                                value={DEEP_LINK}
                            />
                            <a href={DEEP_LINK} target="_blank" rel="noreferrer">
                                <Text fontSize="xs" color="gray.500" textAlign="center">
                                    DEEP LINK
                                </Text>
                            </a>
                        </>
                    ) : (
                        <Spinner size="xl" />
                    )}
                </Box>
            </Center>
        </Stack>
    );
};

export default SigBroLogin;
