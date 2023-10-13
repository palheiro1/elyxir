import { Box, Button, Center, Heading, Image, Stack, Text, useColorModeValue } from '@chakra-ui/react';
// import { Timeline } from 'react-twitter-widgets';
import Jackpot from '../../JackpotWidget/JackpotWidget';
//import LatestTransaction from './LatestTransactions/LatestTransaction';
// import News from './News/News';

const Overview = ({ blockchainStatus }) => {
    const FlowItem = ({ title, button, number, color }) => {
        return (
            <Stack color={color} maxW={"17rem"}>
                <Heading textAlign={'center'} fontSize={'2xl'}>
                    {number}
                </Heading>
                <Text textAlign={'center'} fontWeight="bold">
                    {title}
                </Text>
                <Center>{button}</Center>
            </Stack>
        );
    };

    const MenuButton = ({ icon, text, onClick, bgColor, hoverBg, textColor, fontWeight, isActive }) => {
        return (
            <Button
                key={text}
                minW={'140px'}
                maxW={'160px'}
                color="white"
                minH="50px"
                _hover={{ background: hoverBg, color: 'white' }}
                bgColor={bgColor}
                textColor={textColor}
                onClick={onClick}>
                <Stack direction="row" align="center" w="100%">
                    <Box minW={'2rem'}>
                        <Image src={icon} w={isActive ? '30px' : '25px'} />
                    </Box>
                    <Text fontSize="sm" fontWeight={fontWeight} color="white">
                        {text}
                    </Text>
                </Stack>
            </Button>
        );
    };

    const textColor = useColorModeValue('#2f9088', 'white');
    const textBuy = useColorModeValue('#9f3772', 'white');
    const textOpen = useColorModeValue('#e094b3', 'white');
    const textHistory = useColorModeValue('#3b7197', 'white');
    const textInventory = useColorModeValue('#2f8190', 'white');
    const textJackpot = useColorModeValue('#3b5397', 'white');

    const borderColor = 'rgb(47,144,136)';
    const bgColor = 'rgba(47,144,136,0.10)';

    return (
        <Box>
            <Stack direction={{ base: 'column' }} spacing={4}>
                <Box border="1px" borderColor={borderColor} bgColor={bgColor} rounded="md" p={4}>
                    <Heading textAlign={'center'} fontWeight={'light'} fontSize={'6xl'} color="#2f9088">
                        Welcome to Mythical Beings
                    </Heading>
                    <Text px={{ base: 0, md: 12 }} my={2} color={textColor}>
                        Explore the rich tapestry of Mythical Beings, where every card is a treasure waiting to be
                        unearthed. Dive into the lore, uncover forgotten legends, and become a collector of mythical
                        creatures from across the globe. Complete your collection by gathering all creatures, with
                        enchanting beings hailing from each continent.
                    </Text>
                </Box>
                <Center>
                    <Stack
                        direction={{ base: 'column', md: 'row' }}
                        spacing={{ base: 4, md: 8, lg: 12 }}
                        my={6}
                        align={'center'}>
                        <FlowItem
                            number={1}
                            title="Obtain cards by purchasing GIFTZ"
                            color={textBuy}
                            button={
                                <MenuButton
                                    bgColor={'#9f3772'}
                                    fontWeight={'bold'}
                                    hoverBg={'rgba(159, 55, 114, 0.75)'}
                                    icon={'/images/icons/menu/BuyPack.png'}
                                    isActive={false}
                                    text={'Buy Pack'}
                                />
                            }
                        />
                        <FlowItem
                            number={2}
                            title="Redeem packs for 3 random cards"
                            color={textOpen}
                            button={
                                <MenuButton
                                    bgColor={'#e094b3'}
                                    fontWeight={'bold'}
                                    hoverBg={'rgba(224, 148, 179, 0.75)'}
                                    icon={'/images/icons/menu/OpenPack.png'}
                                    isActive={false}
                                    text={'Open pack'}
                                />
                            }
                        />
                        <FlowItem
                            number={3}
                            title="Watch your History"
                            color={textHistory}
                            button={
                                <MenuButton
                                    bgColor={'#3b7197'}
                                    fontWeight={'bold'}
                                    hoverBg={'rgba(59, 113, 151, 0.75)'}
                                    icon={'/images/icons/menu/blanco/history.png'}
                                    isActive={false}
                                    text={'History'}
                                />
                            }
                        />
                        <FlowItem
                            number={4}
                            title="Investigate your inventory"
                            color={textInventory}
                            button={
                                <MenuButton
                                    bgColor={'#2f8190'}
                                    fontWeight={'bold'}
                                    hoverBg={'rgba(47, 129, 144, 0.75)'}
                                    icon={'/images/icons/menu/blanco/inventory.png'}
                                    isActive={false}
                                    text={'Inventory'}
                                />
                            }
                        />
                    </Stack>
                </Center>

                <Center gap={8}>
                    <FlowItem
                        number={5}
                        title="The Jackpot: Your Ultimate Challenge Awaits!"
                        color={textJackpot}
                        button={
                            <MenuButton
                                bgColor={'#3b5397'}
                                fontWeight={'bold'}
                                hoverBg={'rgba(59, 83, 151, 0.75)'}
                                icon={'/images/icons/menu/blanco/jackpot.png'}
                                isActive={false}
                                text={'Jackpot'}
                            />
                        }
                    />
                    <Jackpot blockchainStatus={blockchainStatus} cStyle={1} />
                </Center>

                <Stack
                    py={8}
                    px={{ base: 0, md: 12 }}
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
