import { Image, Stack, Text } from '@chakra-ui/react';

const InOutTransaction = ({ type, style = 2 }) => {
    if (style === 1) {
        const color = type === 'in' ? 'green' : 'blue.600';

        let msg = '';
        if (type === 'in') {
            msg = 'Received';
        } else if (type === 'out') {
            msg = 'Sent';
        } else if (type === 'placed') {
            msg = 'Placed';
        }

        return (
            <Stack direction="row">
                <Text color={color}> {msg} </Text>
                {type === 'in' && <Image src="/images/inOut/rec.png" w="25px" />}
                {type === 'out' && <Image src="/images/inOut/sent.png" w="25px" />}
                {type === 'placed' && <Image src="/images/inOut/trade.png" w="25px" />}
            </Stack>
        );
    } else {
        const typeTx = type.toLowerCase();

        let icon;
        if (typeTx === 'in') {
            icon = <Image src="/images/inOut/rec.png" w="35px" />;
        } else if (typeTx === 'out') {
            icon = <Image src="/images/inOut/sent.png" w="35px" />;
        } else if (typeTx === 'placed') {
            icon = <Image src="/images/inOut/trade.png" w="35px" />;
        }

        return icon;
    }
};

export default InOutTransaction;
