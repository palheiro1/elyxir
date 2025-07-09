import { Box, Center, Img, SimpleGrid, Spacer, Stack, Text } from '@chakra-ui/react';
import CardBadges from '../../../../Cards/CardBadges';

const CardsGrid = ({ cards, preSelectedCard, onCardClick, isMobile, getColumns }) => (
    <SimpleGrid columns={getColumns()} spacing={3} p={3} h={'100%'} overflowY={'auto'} className="custom-scrollbar">
        {cards.length > 0 ? (
            cards.map((card, i) => {
                const { cardImgUrl, name, rarity, channel, selected } = card;
                const isPreSelected = preSelectedCard?.asset === card.asset;

                return (
                    <Box
                        key={i}
                        position="relative"
                        w={isMobile ? '128px' : '214px'}
                        h={isMobile ? '215px' : '333px'}
                        cursor="pointer"
                        bg="white"
                        onClick={() => !selected && onCardClick(card)}
                        borderRadius="10px">
                        <Center>
                            <Img src={cardImgUrl} w="90%" h="75%" />
                        </Center>
                        <Stack direction={{ base: 'column', lg: 'row' }} spacing={0} mx={2}>
                            <Stack direction="column" spacing={0} align={{ base: 'center', lg: 'start' }}>
                                <Text
                                    fontSize={{ base: 'sm', md: 'md', '2xl': 'xl' }}
                                    noOfLines={1}
                                    fontWeight="bold"
                                    color="#000">
                                    {name}
                                </Text>
                                <CardBadges rarity={rarity} continent={channel} size={isMobile ? '2xs' : 'sm'} />
                            </Stack>
                            <Spacer display={{ base: 'none', lg: 'block' }} />
                        </Stack>
                        {selected && (
                            <Box
                                position="absolute"
                                top="0"
                                left="0"
                                width="100%"
                                height="100%"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                bg="rgba(0, 0, 0, 0.3)"
                            />
                        )}
                        {isPreSelected && (
                            <Box
                                position="absolute"
                                top="0"
                                left="0"
                                width="100%"
                                height="100%"
                                display="flex"
                                borderRadius="inherit"
                                alignItems="center"
                                justifyContent="center"
                                bg="rgba(1, 151, 135, 0.5)"
                                fontFamily="Chelsea Market, system-ui">
                                CHOOSE
                            </Box>
                        )}
                    </Box>
                );
            })
        ) : (
            <Text
                position="absolute"
                fontFamily="Chelsea Market, system-ui"
                color="#FFF"
                fontSize="xl"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)">
                No cards left
            </Text>
        )}
    </SimpleGrid>
);

export default CardsGrid;
