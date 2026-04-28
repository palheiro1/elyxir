import { Box, Button, ButtonGroup, Center, Heading, Image, Input, Stack, Text, Tooltip, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { copyToast } from '../../utils/alerts';
import { EXCHANGES } from '../../data/CONSTANTS';

/**
 * @name Exchange
 * @description This component is the exchange page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Object} infoAccount - Account information
 * @returns {JSX.Element} - JSX element
 */
const Exchange = ({ infoAccount }) => {
    const navigate = useNavigate();
    const [option, setOption] = useState('crypto');

    const toast = useToast();

    useEffect(() => {
        if (infoAccount.token === null || infoAccount.accountRs === null) navigate('/login');
    }, [infoAccount, navigate]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(infoAccount.accountRs);
        copyToast('ARDOR Account', toast);
    };

    const iframeSrc =
        option === 'crypto'
            ? 'https://widget.changelly.com?from=*&to=ignis&amount=0.005&address=&fromDefault=BTC&toDefault=ignis&theme=default&merchant_id=5zk2vil3u4s8witr&payment_id=&v=2'
            : '/simplex.html';
    const iframeHeight = option === 'crypto' ? '385px' : '325px';

    return (
        <>
            <Center>
                <Stack direction="column" spacing={4} align="center">
                    <Heading my={2}>FUND ACCOUNT</Heading>
                    <Tooltip label="Click to copy" hasArrow placement="top-end">
                        <Input isReadOnly textAlign="center" value={infoAccount.accountRs} onClick={copyToClipboard} _hover={{ cursor: 'pointer' }} />
                    </Tooltip>

                    <ButtonGroup variant="outline">
                        <Button isActive={option === 'crypto'} minW="120px" onClick={() => setOption('crypto')}>
                            CRYPTO
                        </Button>
                        <Button isActive={option === 'fiat'} minW="120px" onClick={() => setOption('fiat')}>
                            FIAT
                        </Button>
                    </ButtonGroup>

                    <Box>
                        <Center>
                            <Stack direction="row" spacing={4} align="center">
                                {EXCHANGES.map(exchange => (
                                    <a href={exchange.url} target="_blank" rel="noreferrer" key={exchange.name}>
                                        <Image maxW={'50px'} src={exchange.image} alt={exchange.name} />
                                    </a>
                                ))}
                            </Stack>
                        </Center>
                        <Text fontSize="xs" textAlign="center">
                            *Click on the logo to go to the exchange
                        </Text>
                    </Box>
                </Stack>
            </Center>
            <Center my={10} rounded="lg">
                <Box w={{ base: '90%', md: '50%' }} border="2px" borderColor="gray" overflow="hidden">
                    <iframe
                        src={iframeSrc}
                        title={option === 'crypto' ? 'Changelly widget' : 'Simplex widget'}
                        height={iframeHeight}
                        width="100%"
                        sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                        allow="payment"
                        style={{ minWidth: '100%', border: 0 }}
                    >
                        Cant load widget
                    </iframe>
                </Box>
            </Center>
        </>
    );
};

export default Exchange;
