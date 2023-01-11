import { Box, Stack, Text, useColorModeValue } from "@chakra-ui/react";

const News = () => {

    const NewArticle = ({ date, title, text, url}) => {
        const bgColor = useColorModeValue("blackAlpha.100", "whiteAlpha.100")
        const bgHoverColor = useColorModeValue("blackAlpha.300", "whiteAlpha.300")
        const textColor = useColorModeValue("black", "white")
        return(
            <a href={url}>
                <Box bg={bgColor} _hover={{ bg: bgHoverColor }} p={8} w="100%" rounded="3xl" shadow="xl">
                    <Stack direction="column">
                        <Text color={textColor} fontSize="xs" textTransform="full-width">{date}</Text>
                        <Text color={textColor} fontSize="2xl">{title}</Text>
                        <Text color="grey">{text}</Text>
                    </Stack>
                </Box>
            </a>
        )
    }

    return(
        <Box mt={8}>
            <Text mb={4} fontSize="2xl">News</Text>
            <Stack direction="column">
                <NewArticle date="DEC 12, 2020" title="Introducing: Fancy Variant Badges" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel magna at purus tristique maximus ac vitae enim. Aenean mollis elementum mauris. In molestie leo congue nisi tincidunt tempus. Nam vel tellus ipsum. Duis vel metus ut ante tempus scelerisque. Etiam eget tellus dictum urna lacinia consectetur pretium et dui. Nulla id facilisis est. Morbi faucibus faucibus eros sit amet hendrerit. " url="https://www.google.com/"/>
                <NewArticle date="DEC 12, 2020" title="Introducing: Fancy Variant Badges" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel magna at purus tristique maximus ac vitae enim. Aenean mollis elementum mauris. In molestie leo congue nisi tincidunt tempus. Nam vel tellus ipsum. Duis vel metus ut ante tempus scelerisque. Etiam eget tellus dictum urna lacinia consectetur pretium et dui. Nulla id facilisis est. Morbi faucibus faucibus eros sit amet hendrerit. " url="https://www.google.com/"/>
                <NewArticle date="DEC 12, 2020" title="Introducing: Fancy Variant Badges" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel magna at purus tristique maximus ac vitae enim. Aenean mollis elementum mauris. In molestie leo congue nisi tincidunt tempus. Nam vel tellus ipsum. Duis vel metus ut ante tempus scelerisque. Etiam eget tellus dictum urna lacinia consectetur pretium et dui. Nulla id facilisis est. Morbi faucibus faucibus eros sit amet hendrerit. " url="https://www.google.com/"/>
            </Stack>
        </Box>
    )
}

export default News;