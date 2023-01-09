import { Box, Stack, Text } from "@chakra-ui/react";

const News = () => {

    const NewArticle = ({ date, title, text, url}) => {
        return(
            <a href={url}>
                <Box bg="whiteAlpha.100" p={8} w="100%" rounded="3xl">
                    <Stack direction="column">
                        <Text color="white" fontSize="xs" textTransform="full-width">{date}</Text>
                        <Text color="white" fontSize="2xl">{title}</Text>
                        <Text color="grey">{text}</Text>
                    </Stack>
                </Box>
            </a>
        )
    }

    return(
        <Box mt={12}>
            <Text mt={8} mb={4} fontSize="2xl">News</Text>
            <Stack direction="column">
                <NewArticle date="DEC 12, 2020" title="Introducing: Fancy Variant Badges" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel magna at purus tristique maximus ac vitae enim. Aenean mollis elementum mauris. In molestie leo congue nisi tincidunt tempus. Nam vel tellus ipsum. Duis vel metus ut ante tempus scelerisque. Etiam eget tellus dictum urna lacinia consectetur pretium et dui. Nulla id facilisis est. Morbi faucibus faucibus eros sit amet hendrerit. " url="https://www.google.com/"/>
                <NewArticle date="DEC 12, 2020" title="Introducing: Fancy Variant Badges" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel magna at purus tristique maximus ac vitae enim. Aenean mollis elementum mauris. In molestie leo congue nisi tincidunt tempus. Nam vel tellus ipsum. Duis vel metus ut ante tempus scelerisque. Etiam eget tellus dictum urna lacinia consectetur pretium et dui. Nulla id facilisis est. Morbi faucibus faucibus eros sit amet hendrerit. " url="https://www.google.com/"/>
                <NewArticle date="DEC 12, 2020" title="Introducing: Fancy Variant Badges" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel magna at purus tristique maximus ac vitae enim. Aenean mollis elementum mauris. In molestie leo congue nisi tincidunt tempus. Nam vel tellus ipsum. Duis vel metus ut ante tempus scelerisque. Etiam eget tellus dictum urna lacinia consectetur pretium et dui. Nulla id facilisis est. Morbi faucibus faucibus eros sit amet hendrerit. " url="https://www.google.com/"/>
            </Stack>
        </Box>
    )
}

export default News;