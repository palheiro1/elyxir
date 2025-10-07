import { Badge, Box, Button, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react';

const FlaskSelector = ({ fakeAssets, selectedFlask, setSelectedFlask }) => {
    return (
        <Stack spacing={6} mb={8}>
            <Text fontWeight="bold" fontSize="lg">
                Select Flask (Potion Quantity):
            </Text>
            <Wrap spacing={4}>
                {fakeAssets.flasks.map((flask, idx) => (
                    <WrapItem key={idx}>
                        <Button
                            variant={selectedFlask.asset === flask.asset ? 'solid' : 'outline'}
                            colorScheme="blue"
                            onClick={() => setSelectedFlask(flask)}
                            h="120px"
                            w="120px"
                            flexDirection="column"
                            p={2}>
                            <Box
                                w="60px"
                                h="60px"
                                backgroundImage={`url(${flask.imgUrl})`}
                                backgroundSize="contain"
                                backgroundRepeat="no-repeat"
                                backgroundPosition="center"
                                mb={2}
                            />
                            <Text fontSize="xs" textAlign="center">
                                {flask.name}
                            </Text>
                            <Badge colorScheme="blue" fontSize="xs">
                                x{flask.multiplier} potions
                            </Badge>
                        </Button>
                    </WrapItem>
                ))}
            </Wrap>
        </Stack>
    );
};

export default FlaskSelector;
