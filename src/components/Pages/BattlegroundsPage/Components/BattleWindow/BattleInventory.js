import { Box, Center, Flex, IconButton, Img, SimpleGrid, Spacer, Stack, Text, Tooltip } from '@chakra-ui/react';
import React from 'react';
import CardBadges from '../../../../Cards/CardBadges';
import { ChevronLeftIcon } from '@chakra-ui/icons';

const BattleInventory = ({ setOpenIventory, filteredCards, index, handBattleCards, updateCard }) => {
    return (
        <>
            <IconButton
                icon={<ChevronLeftIcon boxSize={8} />}
                mt={3}
                p={5}
                bg={'transparent'}
                color={'#FFF'}
                _hover={{ bg: 'transparent' }}
                onClick={() => setOpenIventory(false)}>
                Go back
            </IconButton>
            <Stack direction={'row'} pt={2} padding={5} height={'90%'}>
                <Box
                    mb={2}
                    borderRadius={'20px'}
                    p={4}
                    w={'90%'}
                    mx={'auto'}
                    overflowY={'scroll'}
                    className="custom-scrollbar">
                    <SimpleGrid
                        columns={[1, 2, 4]}
                        spacing={5}
                        overflowY={'auto'}
                        className="custom-scrollbar"
                        p={5}
                        overflow={'scroll'}
                        h={'750px'}>
                        {filteredCards
                            .filter(
                                card =>
                                    (index === 0 && card.rarity !== 'Common') ||
                                    (index !== 0 && card.rarity === 'Common')
                            )
                            .map((card, i) => {
                                return card.asset.length <= 19 &&
                                    !handBattleCards.find(item => item.asset === card.asset) ? (
                                    <>
                                        <Box
                                            key={i}
                                            w={'225px'}
                                            h={'350px'}
                                            bg={'white'}
                                            onClick={() => {
                                                setOpenIventory(false);
                                                updateCard(card);
                                            }}
                                            borderRadius={'10px'}>
                                            <Center>
                                                <Img src={card.cardImgUrl} w={'90%'} h={'75%'} />
                                            </Center>
                                            <Stack direction={{ base: 'column', lg: 'row' }} spacing={0} mx={2}>
                                                <Stack
                                                    direction="column"
                                                    spacing={0}
                                                    align={{ base: 'center', lg: 'start' }}>
                                                    <Text
                                                        fontSize={{
                                                            base: 'sm',
                                                            md: 'md',
                                                            '2xl': 'xl',
                                                        }}
                                                        noOfLines={1}
                                                        fontWeight="bold"
                                                        color={'#FFF'}>
                                                        {card.name}
                                                    </Text>
                                                    <CardBadges
                                                        rarity={card.rarity}
                                                        continent={card.channel}
                                                        size="sm"
                                                    />
                                                </Stack>
                                                <Spacer display={{ base: 'none', lg: 'block' }} />
                                                <Center minHeight={{ base: 'auto', lg: '100%' }}>
                                                    <Tooltip display={'flex'} placement="bottom">
                                                        <Flex w={{ base: 'auto', lg: '100%' }}>
                                                            <Text
                                                                textAlign="end"
                                                                minH={{ base: '100%', lg: 'auto' }}
                                                                color={'#000'}>
                                                                <small>Quantity:</small> {card.omnoQuantity}
                                                            </Text>
                                                        </Flex>
                                                    </Tooltip>
                                                </Center>
                                            </Stack>
                                        </Box>
                                    </>
                                ) : null;
                            })}
                    </SimpleGrid>
                </Box>
                <Text color={'red'} position={'absolute'} fontFamily={'Chelsea Market, system-ui'} bottom={2}>
                    * Some cards don't appear to play battles with them, because of code problems. We are working to
                    solve it
                </Text>
            </Stack>
        </>
    );
};

export default BattleInventory;
