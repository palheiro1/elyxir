import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getIgnisPrice } from "../../../services/coingecko/utils";

const UserDataItem = ({ accountRs, name, IGNISBalance, GIFTZBalance, GEMSBalance, bgColor }) => {

    const [ IGNISUSDBalance, setIGNISUSDBalance ] = useState(0);

    useEffect(() => {
        const calculateUSD = async () => {
            const ignisPrice = await getIgnisPrice();
            setIGNISUSDBalance(Number(IGNISBalance * ignisPrice).toFixed(2));
            console.log("cALCULATE")
        }
        calculateUSD();
    }, [IGNISBalance])

    return (
        <GridItem>
            <Box p={6} bgColor={bgColor} rounded="lg" mb={2}>
                <Heading fontSize="lg" pb={2}>
                    Your Ardor account
                </Heading>
                <Text>{accountRs}</Text>
            </Box>
            <Box p={6} bgColor={bgColor} rounded="lg" mb={2}>
                <Heading fontSize="lg" pb={2}>
                    User
                </Heading>
                <Text>{name}</Text>
            </Box>
            <Grid templateColumns="repeat(3, 1fr)" p={6} bgColor={bgColor} rounded="lg">
                <GridItem>
                    <Heading fontSize="lg" pb={2}>
                        IGNIS
                    </Heading>
                    <Text fontSize="sm">{IGNISBalance} ({IGNISUSDBalance} USD)</Text>
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
                    <Text fontSize="sm">{GEMSBalance}</Text>
                </GridItem>
            </Grid>
        </GridItem>
    );
};

export default UserDataItem;
