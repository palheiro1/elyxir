import { AbsoluteCenter, Box, Center, Spinner, Text } from "@chakra-ui/react"

const LoadingSpinner = () => {
    return (
        <Box h="100%" position={"relative"}>
            <AbsoluteCenter>
                <Center>
                    <Spinner thickness='3px' speed='1.05s' emptyColor='#9f3772' variant={"outline"} size={"xl"} />
                </Center>
                <Text mt={4} textAlign="center" fontSize="xl" fontWeight="bold">Loading...</Text>
                <Text mt={-2} textAlign="center">Please wait</Text>
            </AbsoluteCenter>
        </Box>
    )
}

export default LoadingSpinner