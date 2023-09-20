import { Box, Button, Grid, GridItem, Heading, Text, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getIgnisPrice } from '../../../services/coingecko/utils';
import { getIgnisFromFaucet } from '../../../services/Faucet/faucet';
import { errorToast, okToast } from '../../../utils/alerts';

const UserDataItem = ({
    accountRs,
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
    const toast = useToast();

    useEffect(() => {
        const calculateUSD = async () => {
            const ignisPrice = await getIgnisPrice();
            setIGNISUSDBalance(Number(IGNISBalance * ignisPrice).toFixed(2));
        };
        calculateUSD();
    }, [IGNISBalance]);

    const handleClaim = async () => {
        try {
            const response = await getIgnisFromFaucet(accountRs);
            if (!response.error) {
                okToast(response.message, toast);
            } else {
                errorToast(response.message, toast);
            }
        } catch (error) {
            console.error('🚀 ~ file: UserDataItem.js:32 ~ handleClaim ~ error:', error);
            errorToast(error.response.data.message, toast);
        }
    };

    return (
        <GridItem>
            <Box p={6} bgColor={bgColor} mb={2} border="1px" borderColor={borderColor} rounded="lg" shadow="dark-lg">
                <Heading fontSize="lg" pb={2}>
                    Your Ardor account
                </Heading>
                <Text>{accountRs}</Text>
            </Box>
            <Box p={6} bgColor={bgColor} rounded="lg" mb={2} border="1px" borderColor={borderColor} shadow="dark-lg">
                <Heading fontSize="lg" pb={2}>
                    User
                </Heading>
                <Text>{name}</Text>
            </Box>
            <Grid
                templateColumns="repeat(3, 1fr)"
                p={6}
                mb={2}
                bgColor={bgColor}
                rounded="lg"
                border="1px"
                borderColor={borderColor}
                shadow="dark-lg">
                <GridItem>
                    <Heading fontSize="lg" pb={2}>
                        IGNIS
                    </Heading>
                    <Text fontSize="sm">
                        {IGNISBalance} ({IGNISUSDBalance} USD)
                    </Text>
                </GridItem>
                <GridItem>
                    <Heading fontSize="lg" pb={2}>
                        GIFTZ
                    </Heading>
                    <Text fontSize="sm">{GIFTZBalance}</Text>
                </GridItem>
                <GridItem>
                    <Heading fontSize="lg" pb={2}>
                        GEM
                    </Heading>
                    <Text fontSize="sm">{GEMBalance}</Text>
                </GridItem>
                <GridItem>
                    <Heading fontSize="lg" pb={2}>
                        wETH
                    </Heading>
                    <Text fontSize="sm">{WETHBalance}</Text>
                </GridItem>
                <GridItem>
                    <Heading fontSize="lg" pb={2}>
                        MANA
                    </Heading>
                    <Text fontSize="sm">{MANABalance}</Text>
                </GridItem>
            </Grid>
            <Box p={6} bgColor={bgColor} rounded="lg" border="1px" borderColor={borderColor} shadow="dark-lg">
                <Heading fontSize="lg" pb={2}>
                    Faucet (IGNIS)
                </Heading>
                <Text fontSize="sm">
                    {parseFloat(IGNISBalance) <= 0.3 ? (
                        <>
                            <Button w="100%" bgColor={bgColor} borderColor={borderColor} onClick={handleClaim}>
                                Claim
                            </Button>
                            <Text fontSize={'xs'} mt={2}>
                                Use this transfer to get more ignis for your operations, selling currencies or cards in
                                the Market
                            </Text>
                        </>
                    ) : (
                        <Text>You can only claim if you have less than 0.3 IGNIS.</Text>
                    )}
                </Text>
            </Box>
        </GridItem>
    );
};

export default UserDataItem;
