import { Center, Heading, Stack, Text } from "@chakra-ui/react";

const FlowItem = ({ title, subtitle, button, number, color }) => {
    return (
        <Stack color={color} maxW={'17rem'}>
            <Heading textAlign={'center'} fontSize={'2xl'}>
                {number}
            </Heading>
            <Text textAlign={'center'} fontWeight="bold" maxW="150px">
                {title} <br /> {subtitle}
            </Text>
            <Center>{button}</Center>
        </Stack>
    );
};

export default FlowItem;