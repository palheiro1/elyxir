import { Box, Center, Heading, Image, Stack, Text } from '@chakra-ui/react';
// import { Timeline } from 'react-twitter-widgets';
import Jackpot from '../../JackpotWidget/JackpotWidget';
//import LatestTransaction from './LatestTransactions/LatestTransaction';
// import News from './News/News';
import { ArrowForwardIcon } from '@chakra-ui/icons';

const Overview = ({ blockchainStatus }) => {
    const FlowItem = ({ title, image, number, hasNext = false }) => {
        return (
            <Stack direction={'row'}>
                <Stack>
                    <Heading textAlign={'center'} fontSize={'2xl'}>
                        {number}
                    </Heading>
                    <Text textAlign={'center'}>{title}</Text>
                    {image && (
                        <Center>
                            <Image src={image} alt={title} maxW={'125px'} />
                        </Center>
                    )}
                </Stack>
                {hasNext && (
                    <Center>
                        <ArrowForwardIcon boxSize={12} mx={4} />
                    </Center>
                )}
            </Stack>
        );
    };

    return (
        <Box>
            <Stack direction={{ base: 'column' }} spacing={4}>
                <Heading textAlign={'center'} fontWeight={'light'} fontSize={'6xl'}>
                    Welcome to Mythical Beings
                </Heading>
                <Text px={{ base: 0, md: 12 }}>
                    Explore the rich tapestry of Mythical Beings, where every card is a treasure waiting to be
                    unearthed. Dive into the lore, uncover forgotten legends, and become a collector of mythical
                    creatures from across the globe. Complete your collection by gathering all creatures, with
                    enchanting beings hailing from each continent. These creatures are divided into four esteemed
                    groups.
                </Text>
                <Center>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: 4 }} my={6} align={'center'}>
                        <FlowItem
                            number={1}
                            title="Obtain cards by purchasing GIFTZ"
                            image="/images/overview/buy.png"
                            hasNext={true}
                        />
                        <FlowItem
                            number={2}
                            title="Redeem packs fo 3 random cards"
                            image="/images/overview/open.png"
                            hasNext={true}
                        />
                        <FlowItem
                            number={3}
                            title="Watch your History"
                            image="/images/overview/history.png"
                            hasNext={true}
                        />
                        <FlowItem
                            number={4}
                            title="Investigate your inventory"
                            image="/images/overview/inventory.png"
                        />
                    </Stack>
                </Center>
                <Center>
                    <FlowItem number={5} title="The Jackpot: Your Ultimate Challenge Awaits!" />
                </Center>
                <Jackpot blockchainStatus={blockchainStatus} />
                <Stack pt={8}>
                    <Text fontWeight={'bold'}>Here are the mythical currencies you'll encounter on your journey:</Text>
                    <Stack direction="row" align={'center'}>
                        <Image src="/images/currency/ignis.png" alt="Ignis" maxW={'30px'} />
                        <Text>
                            These ethereal flames hold the essence of mythical beings. Every transaction needs a small
                            portion of it. Obtain some daily using our faucet or exchange on our market (or on other
                            centralized exchanges).
                        </Text>
                    </Stack>
                    <Stack direction="row" align={'center'}>
                        <Image src="/images/currency/giftz.png" alt="GIFTZ" maxW={'30px'} />
                        <Text>
                            The very essence of generosity. GIFTZ are tokens of appreciation. They enable you to buy
                            card packs.
                        </Text>
                    </Stack>
                    <Stack direction="row" align={'center'}>
                        <Image src="/images/currency/weth.png" alt="wETH" maxW={'30px'} />
                        <Text>
                            WETH are the ethereal threads connecting our world with the mythical blockchain. They act as
                            a , allowing you to exchange them for GIFTZ, other currencies or cards, expanding your
                            collection and influence.
                        </Text>
                    </Stack>
                    <Stack direction="row" align={'center'}>
                        <Image src="/images/currency/gem.png" alt="GEM" maxW={'30px'} />
                        <Text>
                            Rare gems from forgotten treasure troves, GEM stones open doors to secret realms. They are
                            the lifeblood of crafting and morphing, allowing you to shape your cards into new forms.
                        </Text>
                    </Stack>
                    <Stack direction="row" align={'center'}>
                        <Image src="/images/currency/mana.png" alt="MANA" maxW={'30px'} />
                        <Text>
                            Crystalline sources of mana, MANA crystals are the essence of magic itself. They serve as
                            governance tokens, allowing you to have a say in the destiny of this enchanted realm.
                        </Text>
                    </Stack>
                </Stack>
            </Stack>
            {/* 
            
            <Stack direction={{ base: 'column', xl: 'row' }} spacing={4}>
                
                <Box>
                    <LatestTransaction/>
                </Box>
                
                <Box minW="33%" height="100%">
                    <Timeline
                        dataSource={{
                            sourceType: 'url',
                            url: 'https://twitter.com/BeingsMythical',
                        }}
                        options={{
                            chrome: 'noheader, nofooter',
                            height: '1600px',
                            theme: 'dark',
                        }}
                    />
                </Box>
                
                <News />
            </Stack>
            */}
        </Box>
    );
};

export default Overview;
