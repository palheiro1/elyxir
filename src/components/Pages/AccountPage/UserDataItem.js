import { Box, Button, Grid, GridItem, Heading, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaQrcode } from 'react-icons/fa';
import { getIgnisPrice } from '../../../services/coingecko/utils';
import { checkCanClaim, getRewardsFaucet } from '../../../services/Faucet/faucet';
import { errorToast, okToast } from '../../../utils/alerts';
import ShowQR from '../../ShowQR/ShowQR';

const UserDataItem = ({
    accountRs,
    publicKey,
    name,
    IGNISBalance,
    GIFTZBalance,
    GEMBalance,
    WETHBalance,
    MANABalance,
    bgColor,
    borderColor,
}) => {
    const [IGNISUSDBalance, setIGNISUSDBalance] = useState(0);
    const [isClaimable, setIsClaimable] = useState(false);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        const calculateUSD = async () => {
            const ignisPrice = await getIgnisPrice();
            setIGNISUSDBalance(Number(IGNISBalance * ignisPrice).toFixed(2));
        };
        calculateUSD();
    }, [IGNISBalance]);

    useEffect(() => {
        const checkClaimable = async () => {
            const res = await checkCanClaim(accountRs);
            if (!res.data.error) {
                setIsClaimable(true);
            }
        };
        checkClaimable();
    }, [accountRs]);

    const handleClaim = async () => {
        try {
            const response = await getRewardsFaucet(accountRs, publicKey);
            console.log("🚀 ~ handleClaim ~ response:", response)
            if (!response.data.error) {
                okToast(response.message, toast);
                setIsClaimable(false)
            } else {
                errorToast(response.data.message, toast);
            }
        } catch (error) {
            console.error('🚀 ~ file: UserDataItem.js:32 ~ handleClaim ~ error:', error);
            errorToast(error.response.data.message || 'ERROR', toast);
        }
    };

    const ContainerText = ({ children }) => (
        <Box p={2} bgColor={bgColor} mb={2} border="1px" borderColor={borderColor} rounded="lg">
            <Box p={6} bgColor={bgColor} border="1px" borderColor={borderColor} rounded="lg">
                {children}
            </Box>
        </Box>
    );

    return (
        <>
            <GridItem>
                <ContainerText>
                    <Heading fontSize="lg" pb={2}>
                        Your ARDOR account
                    </Heading>
                    <Text>{accountRs}</Text>
                    <Button
                        w="100%"
                        mt={6}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        leftIcon={<FaQrcode />}
                        onClick={onOpen}>
                        Show QR
                    </Button>
                </ContainerText>
                <ContainerText>
                    <Heading fontSize="lg" pb={2}>
                        User
                    </Heading>
                    <Text>{name}</Text>
                </ContainerText>
                <ContainerText>
                    <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                        <GridItem>
                            <Box bgColor={bgColor} rounded="lg" p={4}>
                                <Heading fontSize="lg" pb={2}>
                                    IGNIS
                                </Heading>
                                <Text fontSize="sm">
                                    {IGNISBalance} ({IGNISUSDBalance} USD)
                                </Text>
                            </Box>
                        </GridItem>
                        <GridItem>
                            <Box bgColor={bgColor} rounded="lg" p={4}>
                                <Heading fontSize="lg" pb={2}>
                                    GIFTZ
                                </Heading>
                                <Text fontSize="sm">{GIFTZBalance}</Text>
                            </Box>
                        </GridItem>
                        <GridItem>
                            <Box bgColor={bgColor} rounded="lg" p={4}>
                                <Heading fontSize="lg" pb={2}>
                                    GEM
                                </Heading>
                                <Text fontSize="sm">{GEMBalance}</Text>
                            </Box>
                        </GridItem>
                        <GridItem>
                            <Box bgColor={bgColor} rounded="lg" p={4}>
                                <Heading fontSize="lg" pb={2}>
                                    wETH
                                </Heading>
                                <Text fontSize="sm">{WETHBalance}</Text>
                            </Box>
                        </GridItem>
                        <GridItem>
                            <Box bgColor={bgColor} rounded="lg" p={4}>
                                <Heading fontSize="lg" pb={2}>
                                    MANA
                                </Heading>
                                <Text fontSize="sm">{MANABalance}</Text>
                            </Box>
                        </GridItem>
                    </Grid>
                </ContainerText>
                <ContainerText>
                    <Heading fontSize="lg" pb={2}>
                        Daily rewards
                    </Heading>
                    <Box fontSize="sm">
                        {isClaimable ? (
                            <>
                                <Button w="100%" bgColor={bgColor} borderColor={borderColor} onClick={handleClaim}>
                                    Claim
                                </Button>
                                <Text fontSize={'xs'} mt={2}>
                                    Here you can get some daily rewards (1 IGNIS, 1 GEM and 1 MANA). This have a total
                                    limit of 100 claims (1 per account and IP)
                                </Text>
                            </>
                        ) : (
                            <Text>You can only claim the rewards once a day per account and IP. </Text>
                        )}
                    </Box>
                </ContainerText>
            </GridItem>
            {isOpen && <ShowQR isOpen={isOpen} onClose={onClose} account={accountRs} />}
        </>
    );
};

export default UserDataItem;
