import { Box, Stack, Text } from '@chakra-ui/react';

const SinglePost = ({ date, title, text, url }) => {
    const bgColor = 'rgba(47, 144, 136, 0.25)';
    const bgHoverColor = 'rgba(47, 144, 136, 0.35)';
    const borderColor = 'rgba(47, 144, 136, 1)';
    const textColor = 'white';

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
                    <Text color={textColor}>{text}</Text>
                </Stack>
            </Box>
        </a>
    );
};

export default SinglePost;
