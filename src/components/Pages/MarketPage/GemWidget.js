import { Box, Button, Center, Grid, GridItem, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { NQTDIVIDER } from '../../../data/CONSTANTS';

const GemWidget = ({ gemCards }) => {
    const lowestGemAsk = gemCards.askOrders.length > 0 ? gemCards.askOrders[0].priceNQTPerShare / NQTDIVIDER : 0;
    const highestGemBid = gemCards.bidOrders.length > 0 ? gemCards.bidOrders[0].priceNQTPerShare / NQTDIVIDER : 0;

    let confirmedBalance = Number(gemCards.quantityQNT / NQTDIVIDER);
    confirmedBalance = Number.isInteger(confirmedBalance) ? confirmedBalance.toFixed(0) : confirmedBalance.toFixed(2);

    let unconfirmedBalance = Number(gemCards.unconfirmedQuantityQNT / NQTDIVIDER);
    unconfirmedBalance = Number.isInteger(unconfirmedBalance)
        ? unconfirmedBalance.toFixed(0)
        : unconfirmedBalance.toFixed(2);

    // ------------------------------

    const [hover, setHover] = useState(false);
    const initialStyle = {
        cursor: 'none',
        transform: 'scale(1)',
        transition: 'all 1.3s ease-in-out',
        shadow: 'none',
    };
    const hoverStyle = {
        cursor: 'pointer',
        transform: 'scale(1.15)',
        transition: 'all 0.6s ease-in-out',
        shadow: 'lg',
    };

    // ------------------------------

    return (
        <Center mb={2}>
            <Grid
                templateColumns="repeat(5, 1fr)"
                bgColor="whiteAlpha.200"
                p={2}
                rounded="full"
                textAlign="center"
                gap={4}>
                <Center borderRight="1px" borderColor="whiteAlpha.300">
                    <GridItem>
                        <Box>
                            <Heading fontSize="3xl">GEM</Heading>
                            <Text>Currency</Text>
                        </Box>
                    </GridItem>
                </Center>
                <Center borderRight="1px" borderColor="whiteAlpha.300">
                    <GridItem>
                        <Box>
                            <Heading fontSize="lg">Amount</Heading>
                            <Text>
                                {confirmedBalance} ({unconfirmedBalance})
                            </Text>
                        </Box>
                    </GridItem>
                </Center>
                <Center borderRight="1px" borderColor="whiteAlpha.300">
                    <GridItem>
                        <Box>
                            <Heading fontSize="lg">Low</Heading>
                            <Text>{lowestGemAsk} IGNIS</Text>
                        </Box>
                    </GridItem>
                </Center>
                <Center borderRight="1px" borderColor="whiteAlpha.300">
                    <GridItem>
                        <Box>
                            <Heading fontSize="lg">High</Heading>
                            <Text>{highestGemBid} IGNIS</Text>
                        </Box>
                    </GridItem>
                </Center>
                <Center
                    style={hover ? hoverStyle : initialStyle}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}>
                    <GridItem>
                        <Button p={4} variant="ghost" h="100%" _hover={{ bgColor: 'transparent' }} fontWeight="bolder" textTransform="full-width">
                            TRADE NOW
                        </Button>
                    </GridItem>
                </Center>
            </Grid>
        </Center>
    );
};

export default GemWidget;
