import { Box, Center, Flex, Heading, Img, SimpleGrid, Spacer, Stack, Text, Tooltip } from '@chakra-ui/react';
import CardBadges from '../../../../Cards/CardBadges';
import ArdorCards from './ArdorCards';

const ArdorPage = ({ cards, filteredCards, infoAccount, isMobile }) => {
    const userCards = cards.filter(card => card.unconfirmedQuantityQNT >= 1);

    return (
        <>
            <Stack direction={'column'} color={'#FFF'} mb={5} mx={'auto'} textAlign={'center'} maxH={'90%'}>
                <Heading fontFamily={'Chelsea Market, System'} fontWeight={100}>
                    INVENTORY
                </Heading>
                <Text>Here you can withdraw your cards from the army to your inventory</Text>
            </Stack>
            <Stack direction={'row'} pt={2} padding={5} height={'90%'}>
                <Box
                    mb={4}
                    backgroundColor={'#0F0F0F'}
                    borderRadius={'20px'}
                    p={2}
                    w={isMobile ? '45%' : '65%'}
                    overflowY={'scroll'}
                    className="custom-scrollbar"
                    mx="auto"
                    display="flex"
                    justifyContent="center">
                    <SimpleGrid
                        columns={isMobile ? 1 : 3}
                        spacing={4}
                        overflowY={'auto'}
                        className="custom-scrollbar"
                        p={4}
                        overflow={'scroll'}
                        h={'750px'}>
                        {userCards.map((card, cardIndex) => (
                            <Box key={cardIndex} w={'225px'} h={'350px'} bg={'white'} borderRadius={'10px'}>
                                <Center>
                                    <Img src={card.cardImgUrl} w={'90%'} h={'75%'} />
                                </Center>
                                <Stack direction={{ base: 'column', lg: 'row' }} spacing={0} mx={2}>
                                    <Stack direction="column" spacing={0} align={{ base: 'center', lg: 'start' }}>
                                        <Text
                                            fontSize={{ base: 'sm', md: 'md', '2xl': 'xl' }}
                                            noOfLines={1}
                                            fontWeight="bold"
                                            color={'#000'}>
                                            {card.name}
                                        </Text>
                                        <CardBadges rarity={card.rarity} continent={card.channel} size="sm" />
                                    </Stack>
                                    <Spacer display={{ base: 'none', lg: 'block' }} />
                                    <Center minHeight={{ base: 'auto', lg: '100%' }}>
                                        <Tooltip display={'flex'} placement="bottom">
                                            <Flex w={{ base: 'auto', lg: '100%' }}>
                                                <Text
                                                    textAlign="end"
                                                    minH={{ base: '100%', lg: 'auto' }}
                                                    color={'#000'}>
                                                    <small>Quantity:</small> {card.quantityQNT}
                                                </Text>
                                            </Flex>
                                        </Tooltip>
                                    </Center>
                                </Stack>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Box>
                <Box
                    mb={4}
                    maxW={isMobile ? '80%' : '60%'}
                    backgroundColor={'#0F0F0F'}
                    borderRadius={'20px'}
                    p={4}
                    className="custom-scrollbar"
                    overflowX={'scroll'}>
                    <ArdorCards infoAccount={infoAccount} cards={filteredCards} />
                </Box>
            </Stack>
        </>
    );
};

export default ArdorPage;
