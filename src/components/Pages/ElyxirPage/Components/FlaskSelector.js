import { Badge, Box, Button, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react';

const FlaskSelector = ({ flasks, selectedFlask, setSelectedFlask, isPotionSelected }) => {
    return (
        isPotionSelected && (
            <Stack spacing={6} mb={8}>
                <Text fontWeight="bold" fontSize="lg">
                    Select Flask (Potion Quantity):
                </Text>
                <Wrap spacing={4}>
                    {flasks.map((flask, idx) => {
                        return (
                            <WrapItem key={idx} position={'relative'}>
                                <Button
                                    variant={selectedFlask?.asset === flask?.asset ? 'solid' : 'outline'}
                                    colorScheme="blue"
                                    onClick={() => setSelectedFlask(flask)}
                                    h="120px"
                                    w="120px"
                                    flexDirection="column"
                                    p={2}
                                    disabled={flask?.quantityQNT <= 0}>
                                    <Box
                                        w="60px"
                                        h="60px"
                                        backgroundImage={`url(${flask?.imgUrl})`}
                                        backgroundSize="contain"
                                        backgroundRepeat="no-repeat"
                                        backgroundPosition="center"
                                        mb={2}
                                    />
                                    <Text fontSize="xs" textAlign="center">
                                        {flask?.name}
                                    </Text>
                                    <Badge colorScheme="blue" fontSize="xs">
                                        x{flask?.multiplier} potions
                                    </Badge>
                                </Button>
                                <Badge
                                    right={-2}
                                    top={-2}
                                    borderRadius={'full'}
                                    boxSize={'25px'}
                                    position={'absolute'}
                                    bgColor={'#4a83de'}
                                    textTransform={'lowercase'}
                                    align={'center'}>
                                    <Text mx={'auto'}>x{flask?.quantityQNT}</Text>
                                </Badge>
                            </WrapItem>
                        );
                    })}
                </Wrap>
            </Stack>
        )
    );
};

export default FlaskSelector;
