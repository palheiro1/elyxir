import { Box, Stack, Text, useColorModeValue } from '@chakra-ui/react';

const News = () => {
    const NewArticle = ({ date, title, text, url }) => {
        const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
        const bgHoverColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
        const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
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

    return (
        <Box mt={8}>
            <Text mb={4} fontSize="2xl">
                News
            </Text>
            <Stack direction="column">
                <NewArticle
                    date="NOV 28, 2022"
                    title="Morphing creatures: updating Mythical Beings"
                    text="Step by step, our vision is making solid progress. In this update we are adding a new feature, Morphing, which also paves the way for the in-game economy, creating a first use and marketplace for ingame..."
                    url="https://tarasca-dao.medium.com/morphing-creatures-updating-mythical-beings-579c527840d"
                />
                <NewArticle
                    date="OCT 12, 2022"
                    title="Season 05: The first round is over, the adventure begins!"
                    text="In this fifth season of Mythical Beings, the 50 creatures are finally deployed across the land, ten for each continent. Is that all? No more..."
                    url="https://tarasca-dao.medium.com/season-05-the-first-round-is-over-the-adventure-begins-691ee7c86803"
                />
            </Stack>
        </Box>
    );
};

export default News;
