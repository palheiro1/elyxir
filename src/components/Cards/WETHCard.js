import { Image, Stack, Text } from '@chakra-ui/react';

const WETHCard = ({ hover = false }) => {
    return (
        <Stack direction={'row'} spacing={4} align="center">
            <Image maxW="75px" src="/images/currency/weth.png" alt="wETH" />
            <Text fontWeight="bold" fontSize="2xl">
                {hover ? 'Delete order' : 'wETH'}
            </Text>
        </Stack>
    );
};

export default WETHCard;
