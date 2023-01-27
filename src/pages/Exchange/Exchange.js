import {
    Box,
    Button,
    ButtonGroup,
    Center,
    Heading,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Iframe(props) {
    return <div dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : '' }} />;
}

const Exchange = ({ infoAccount }) => {
    const navigate = useNavigate();
    const [option, setOption] = useState('crypto');
    //const bgColor = useColorModeValue('gray.100', 'gray.700');

    useEffect(() => {
        if (infoAccount === undefined || !infoAccount.token) {
            navigate('/login');
        }
    }, [infoAccount, navigate]);

    if (!infoAccount) return null;
    const { accountRs } = infoAccount;

    return (
        <>
            <Center>
                <Stack direction="column" spacing={4} align="center">
                    <Heading my={2}>FUND ACCOUNT</Heading>
                    <Text textAlign="center">{accountRs}</Text>

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
                    <Box w="30%" h="400px" border="2px" borderColor="gray">
                        <Iframe
                            iframe={
                                '<iframe src="https://widget.changelly.com?from=*&to=ignis&amount=0.005&address=&fromDefault=BTC&toDefault=ignis&theme=default&merchant_id=5zk2vil3u4s8witr&payment_id=&v=2" width="100%" height="400" class="changelly" scrolling="no" style="min-width: 100%; width: 100px; overflow-y: hidden; border: none">Cant load widget</iframe>'
                            }
                        />
                    </Box>
                </Center>
            )}

            {option === 'fiat' && (
                <Center my={10} rounded="lg">
                    <Box w="30%" h="400px" border="2px" borderColor="gray">
                        <form id="simplex-form">
                            <div id="checkout-element"></div>
                        </form>
                        <script
                            src="https://iframe.sandbox.test-simplexcc.com/form-sdk.js"
                            type="text/javascript"></script>
                    </Box>
                </Center>
            )}
        </>
    );
};

export default Exchange;
