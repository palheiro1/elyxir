import { Box, Button, Center, Image, Stack, Text } from '@chakra-ui/react';

import { BsArrowLeftRight, BsTools } from 'react-icons/bs';
import { FaRegPaperPlane } from 'react-icons/fa';

const Card = ({ name, image, quantity, continent, rarity }) => {
    return (
        <Box
            p={8}
            m={4}
            border="1px"
            rounded="3xl"
            borderColor="gray"
            shadow="dark-lg"
        >
            <Stack direction="column" spacing={4} shadow={"inner"}>
                <Image src={image} alt={name} />
                <Stack direction="row" spacing={4}>
                    <Box>
                        <Text fontSize="xl" fontWeight="bolder" >
                            {name}
                        </Text>
                        <Text color="gray" fontSize="md">
                            {continent} / {rarity}{' '}
                        </Text>
                    </Box>
                    <Center experimental_spaceX={2}>
                        <Text>Quantity: </Text>
                        <Text> {quantity}</Text>
                    </Center>
                </Stack>
                <Center>
                    <Stack direction="row">
                        <Button
                            leftIcon={<BsArrowLeftRight />}
                            _hover={{ fontWeight: 'bold', shadow: 'xl' }}
                        >
                            Trade
                        </Button>
                        <Button
                            leftIcon={<FaRegPaperPlane />}
                            _hover={{ fontWeight: 'bold', shadow: 'xl' }}
                        >
                            Send
                        </Button>
                        <Button
                            leftIcon={<BsTools />}
                            _hover={{ fontWeight: 'bold', shadow: 'xl' }}
                        >
                            Craft
                        </Button>
                    </Stack>
                </Center>
            </Stack>
        </Box>
    );
};

export default Card;
