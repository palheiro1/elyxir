import { Box, Center, Heading, Image, SimpleGrid, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { EXCHANGES } from '../../../data/CONSTANTS';

const Welcome = () => {

    const navigate = useNavigate();

    const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
    const bgHoverColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
    return (
        <Center mt={2}>
            <Stack direction="column">
                <Box my={4}>
                    <Heading fontSize="5xl" textAlign="center" fontWeight="light">
                        Welcome to <br />
                        <strong>Mythical Beings</strong>
                    </Heading>
                    <Text textAlign="center" fontWeight="light" color="gray">
                        You seem to have no funds or cards yet.
                    </Text>
                </Box>

                <Box>
                    <Text my={2} textAlign="center">Fund your account using</Text>
                    <SimpleGrid columns={2} spacing={4}>
                        <Box
                            textAlign="center"
                            p={4}
                            rounded="lg"
                            borderColor="whiteAlpha.300"
                            bgColor={bgColor}
                            _hover={{ cursor: 'pointer', bgColor: bgHoverColor }}>
                            <Text>Simplex</Text>
                            <Text>(Fiat to IGNIS)</Text>
                        </Box>
                        <Box
                            textAlign="center"
                            p={4}
                            bgColor={bgColor}
                            rounded="lg"
                            borderColor="whiteAlpha.300"
                            _hover={{ cursor: 'pointer', bgColor: bgHoverColor }}>
                            <Text>Changelly</Text>
                            <Text>(Crypto to IGNIS)</Text>
                        </Box>
                    </SimpleGrid>
                </Box>
                <Box textAlign="center" p={4} rounded="lg" borderColor="whiteAlpha.300" bgColor={bgColor}>
                    <Center>
                        <Text p={4}>
                            Get your IGNIS from one of the many exchange like
                            <br />
                            Bitrex, Probit, STEX and many more.
                        </Text>
                    </Center>
                    <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
                        {EXCHANGES.map(exchange => (
                            <Center p={4} border="1px" borderColor={bgHoverColor} rounded="lg" _hover={ { cursor: 'pointer', bgColor: bgHoverColor } }>
                                <a href={exchange.url} target="_blank" rel="noreferrer">
                                    <Box textAlign="center">
                                        <Center>
                                            <Image src={exchange.image} alt={exchange.name} />
                                        </Center>
                                        <Text mt={2}>{exchange.name}</Text>
                                    </Box>
                                </a>
                            </Center>
                        ))}
                    </SimpleGrid>
                </Box>
                <Center p={4} border="1px" borderColor={bgHoverColor} rounded="lg" _hover={ { cursor: 'pointer', bgColor: bgHoverColor } } onClick={() => navigate("/home")}>
                    GO TO MY WALLET
                </Center>
            </Stack>
        </Center>
    );
};

export default Welcome;
