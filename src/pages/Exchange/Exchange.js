import { Box, Button, ButtonGroup, Center, Heading, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    useEffect(() => {
        if (infoAccount.token === null || infoAccount.accountRs === null) navigate('/login');
    }, [infoAccount, navigate]);

    return (
        <>
            <Center>
                <Stack direction="column" spacing={4} align="center">
                    <Heading my={2}>FUND ACCOUNT</Heading>
                    <Text textAlign="center">{infoAccount.accountRs}</Text>

                    <ButtonGroup variant="outline">
                        <Button isActive={option === 'crypto'} minW="120px" onClick={() => setOption('crypto')}>
                            CRYPTO
                        </Button>
                        <Button isActive={option === 'fiat'} minW="120px" onClick={() => setOption('fiat')}>
                            FIAT
                        </Button>
                    </ButtonGroup>
                </Stack>
            </Center>
            {option === 'crypto' && (
                <Center my={10} rounded="lg">
                    <Box w={{ base: '90%', md: '50%' }} border="2px" borderColor="gray">
                        <Iframe
                            iframe={
                                '<iframe src="https://widget.changelly.com?from=*&to=ignis&amount=0.005&address=&fromDefault=BTC&toDefault=ignis&theme=default&merchant_id=5zk2vil3u4s8witr&payment_id=&v=2" height="300px" class="changelly" scrolling="no" style="min-width: 100%; width: 100px; overflow-y: hidden; border: none">Cant load widget</iframe>'
                            }
                        />
                    </Box>
                </Center>
            )}

            {option === 'fiat' && (
                <Center my={10} rounded="lg">
                    <Box w={{ base: '90%', md: '50%' }} border="2px" borderColor="gray">
                        <Iframe
                            iframe={
                                '<iframe src="/simplex.html" height="300px" class="simplex" scrolling="no" style="min-width: 100%; width: 100px; overflow-y: hidden; border: none">Cant load widget</iframe>'
                            }
                        />
                    </Box>
                </Center>
            )}
        </>
    );
};

export default Exchange;
