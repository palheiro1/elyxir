import { Box, Center, Heading, Image, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import HowToPlay from './HowToPlay/HowToPlay';
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

                <HowToPlay />

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

                <Stack
                    py={8}
                    px={{ base: 2, md: 12 }}
                    spacing={6}
                    color={textColor}
                    border="1px"
                    borderColor={borderColor}
                    bgColor={bgColor}
                    rounded="md">
                    <Text fontWeight={'bold'}>Here are the mythical currencies you'll encounter on your journey:</Text>
                    <Stack direction="row" align={'center'}>
                        <Image src="/images/currency/ignis.png" alt="Ignis" maxW={'35px'} />
                        <Text>
                            These mystic flames IGNIS hold the essence of mythical beings. Every transaction needs a
                            small portion of it. <br />
                            Obtain some daily using our faucet or exchange on our market (or on other centralized
                            exchanges).
                        </Text>
                    </Stack>
                    <Stack direction="row" align={'center'}>
                        <Image src="/images/currency/giftz.png" alt="GIFTZ" maxW={'35px'} />
                        <Text>
                            The very essence of generosity. GIFTZ are tokens of appreciation. <br />
                            They enable you to buy card packs.
                        </Text>
                    </Stack>
                    <Stack direction="row" align={'center'}>
                        <Image src="/images/currency/weth.png" alt="wETH" maxW={'35px'} />
                        <Text>
                            WETH are the ethereal threads connecting our world with the mythical blockchain.
                            <br /> They act as a bridge, allowing you to exchange them for GIFTZ, other currencies or
                            cards, expanding your collection and influence.
                        </Text>
                    </Stack>
                    <Stack direction="row" align={'center'}>
                        <Image src="/images/currency/gem.png" alt="GEM" maxW={'35px'} />
                        <Text>
                            Rare gems from forgotten treasure troves, GEM stones open doors to secret realms. <br />
                            They are the lifeblood of crafting and morphing, allowing you to shape your cards into new
                            forms.
                        </Text>
                    </Stack>
                    <Stack direction="row" align={'center'}>
                        <Image src="/images/currency/mana.png" alt="MANA" maxW={'35px'} />
                        <Text>
                            Crystalline sources of mana, MANA crystals are the essence of magic itself. <br />
                            They serve as governance tokens, allowing you to have a say in the destiny of this enchanted
                            realm.
                        </Text>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
};

export default Overview;
