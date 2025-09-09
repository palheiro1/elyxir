import { Box, Grid, GridItem, Image, Text, useBreakpointValue } from '@chakra-ui/react';
import { NQTDIVIDER, SEASONSPECIALCARDASSET } from '../../../../../data/CONSTANTS';

// Simple address formatter function
const formatAddress = (address) => {
    if (!address || address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const RewardsTableRow = ({ index, data, accountRs, filter, getCurrencyImage }) => {
    const { address, accountName, quantity, ticketNumber, assetId, assetName } = data;
    let assetDetails = null;
    let name = null;
    let formattedQNT = quantity;
    try {
        assetDetails = JSON.parse(data.assetDetails.description);
        name = assetDetails.name;
    } catch (error) {
        name = assetName;
        formattedQNT = quantity / NQTDIVIDER;
    }

    const bg = filter
        ? index % 2 === 0
            ? '#323636'
            : '#202323'
        : accountRs === address
        ? '#73DDE8'
        : index % 2 === 0
        ? '#323636'
        : '#202323';

    const color = filter ? '#7FC0BE' : accountRs === address ? '#193235' : '#7FC0BE';

    const formattedAddress = useBreakpointValue({
        base: formatAddress(address),
        md: address,
    });

    return (
        <Grid templateColumns="repeat(3, 1fr)" gap={4} w="100%" mx="auto" mt={0} bgColor={bg} borderRadius="10px" p={2}>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={1}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={500}
                    color={color}
                    h="100%"
                    fontSize={{ base: 'xs', md: 'md' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {Number(ticketNumber) === 0 ? 'Distribution' : `#${ticketNumber}`}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={1}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={500}
                    color={color}
                    h="100%"
                    fontSize={{ base: 'xs', md: 'md' }}
                    display="flex"
                    alignItems="center"
                    textTransform={'capitalize'}
                    justifyContent="center">
                    {accountRs === address ? 'You' : accountName || formattedAddress}
                </Text>
            </GridItem>
            <GridItem colSpan={1} justifyContent="center" display={'flex'}>
                <Box
                    h={assetId === SEASONSPECIALCARDASSET ? '20px' : '30px'}
                    w={assetId === SEASONSPECIALCARDASSET ? '20px' : '30px'}
                    mr={2}
                    my={'auto'}>
                    <Image src={getCurrencyImage(assetId)} w={'100%'} />
                </Box>
                <Text
                    p={1}
                    maxH={'45px'}
                    my={'auto'}
                    fontFamily={'Inter, System'}
                    fontWeight={500}
                    h="100%"
                    fontSize={{ base: 'xs', md: 'md' }}
                    color={color}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">{`x${formattedQNT} ${name}`}</Text>
            </GridItem>
        </Grid>
    );
};

export default RewardsTableRow;
