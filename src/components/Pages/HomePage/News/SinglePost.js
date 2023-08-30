import { Box, Stack, Text, useColorModeValue } from '@chakra-ui/react';

const SinglePost = ({ date, title, text, url }) => {
    const bgColor = useColorModeValue('blackAlpha.50', 'rgba(47,144,136,0.5)');
    const bgHoverColor = useColorModeValue('blackAlpha.100', 'rgba(47,144,136,0.7)');
    const borderColor = useColorModeValue('blackAlpha.300', 'rgba(47,144,136,1)');
    const textColor = useColorModeValue('black', 'white');

    return (
        <a href={url} target="_blank" rel="noreferrer">
            <Box
                bg={bgColor}
                _hover={{ bg: bgHoverColor }}
                p={8}
                w="100%"
                shadow="xl"
                border="1px"
                borderColor={borderColor}
                rounded="lg">
                <Stack direction="column">
                    <Text color={textColor} fontSize="xs" textTransform="full-width">
                        {date}
                    </Text>
                    <Text color={textColor} fontSize="2xl">
                        {title}
                    </Text>
                    <Text color="grey">{text}</Text>
                </Stack>
            </Box>
        </a>
    );
};

export default SinglePost;
