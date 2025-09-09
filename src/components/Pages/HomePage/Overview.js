import { Box, Center, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { ACTUAL_SEASON, IS_BOUNTY_ENABLED } from '../../../data/CONSTANTS';

const Overview = () => {
    const textColor = useColorModeValue('#2f9088', 'white');

    const borderColor = 'rgb(47,144,136)';
    const bgColor = 'rgba(47,144,136,0.10)';

    return (
        <Box>
            <Stack direction={{ base: 'column' }} spacing={4}>
                <Box
                    border="1px"
                    borderColor={borderColor}
                    bgColor={bgColor}
                    rounded="md"
                    p={4}
                    px={{ base: 2, lg: 12 }}>
                    <Center gap={2}>
                        <Heading
                            textAlign={'center'}
                            fontWeight={'light'}
                            fontSize={{ base: 'xl', lg: '2xl', xl: '6xl' }}
                            color="#2f9088">
                            Welcome to
                        </Heading>
                        <Heading
                            textAlign={'center'}
                            fontWeight={'medium'}
                            fontSize={{ base: 'xl', lg: '2xl', xl: '6xl' }}
                            color="#2f9088">
                            Mythical Beings
                        </Heading>
                    </Center>
                    <Text my={2} color={textColor}>
                        Explore the rich tapestry of Mythical Beings, where every card is a treasure waiting to be
                        unearthed. Dive into the lore, uncover forgotten legends, and become a collector of mythical
                        creatures from across the globe. Complete your collection by gathering all creatures, with
                        enchanting beings hailing from each continent.
                    </Text>
                </Box>

                {!IS_BOUNTY_ENABLED && (
                    <Stack
                        direction={'column'}
                        py={8}
                        spacing={2}
                        color={textColor}
                        border="1px"
                        borderColor={borderColor}
                        bgColor={bgColor}
                        rounded="md">
                        <Text fontSize={{ base: 'md', lg: 'lg', xl: '2xl' }} fontWeight={'bolder'} textAlign={'center'}>
                            Season {ACTUAL_SEASON} has come to an end, but don't worry — Season {ACTUAL_SEASON + 1} is
                            just around the corner.
                        </Text>
                        <Text textAlign={'center'}>
                            Stay tuned to our{' '}
                            <a href="https://x.com/BeingsMythical" target="_blank" rel="noreferrer">
                                <strong>Twitter</strong>
                            </a>{' '}
                            or{' '}
                            <a href="https://discord.gg/JyPugMEC5y" target="_blank" rel="noreferrer">
                                <strong>Discord</strong>
                            </a>{' '}
                            channel!
                        </Text>
                    </Stack>
                )}
            </Stack>
        </Box>
    );
};

export default Overview;
