import { Box, Button, ButtonGroup, Center, Heading, Image, Input, Stack, Text, Tooltip, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { copyToast } from '../../utils/alerts';
import { EXCHANGES } from '../../data/CONSTANTS';

function Iframe(props) {
    return <div dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : '' }} />;
}

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

    const changellyIframe =
        '<iframe src="https://widget.changelly.com?from=*&to=ignis&amount=0.005&address=&fromDefault=BTC&toDefault=ignis&theme=default&merchant_id=5zk2vil3u4s8witr&payment_id=&v=2" height="385px" class="changelly" style="min-width: 100%;">Cant load widget</iframe>';
    const simplexIframe =
        '<iframe src="/simplex.html" height="325px" style="min-width: 100%;">Cant load widget</iframe>';

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
                    <Iframe iframe={option === 'crypto' ? changellyIframe : simplexIframe} />
                </Box>
            </Center>
        </>
    );
};

export default Exchange;
