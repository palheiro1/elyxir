import { Box, Button, Heading, Image, Img, Stack, Text } from '@chakra-ui/react';
import logo from '../../assets/image.png';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import locations from '../../assets/LocationsEnum';
import welcome1 from '../../assets/wellcome1.svg';
import welcome2 from '../../assets/wellcome2.svg';

export const PageOne = ({ handleNext }) => {
    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
            }}>
            <Image src={welcome1} position={'absolute'} top={0} left={0} h={'70%'} />
            <Image src={welcome2} position={'absolute'} bottom={0} right={0} h={'80%'} />
            <Stack
                fontFamily={'Chelsea Market, system-ui'}
                color={'#FFF'}
                display={'flex'}
                mt={8}
                direction={'column'}
                fontWeight={'100'}
                fontSize={'large'}>
                <Text mt={8}>Wellcome to</Text> <Img src={logo} w={'85%'} ml={5} />
            </Stack>
            <Box>
                <Heading
                    color={'#FFF'}
                    fontFamily={'Chelsea Market, system-ui'}
                    textTransform={'uppercase'}
                    size={'md'}
                    textAlign={'center'}
                    mt={7}
                    fontWeight={'100'}
                    mx={'auto'}
                    w={'450px'}>
                    Prepare your creatures and conquer the world!
                </Heading>
                <Text
                    color={'#FFF'}
                    fontFamily={'Inter, sans-serif'}
                    fontWeight={'400'}
                    fontSize={'md'}
                    mx={'auto'}
                    mt={6}
                    w={'500px'}
                    textAlign={'justify'}>
                    <strong>Battlegrounds</strong> is the playground for Mythical Beings NFTs. The world is divided into{' '}
                    {locations.length} territories, each of which can be conquered and defended by a battalion of
                    mythological creatures.
                </Text>
            </Box>

            <Box>
                <Button
                    colorScheme="transparent"
                    mx={'auto'}
                    mt={10}
                    onClick={handleNext}
                    fontFamily={'Chelsea Market, system-ui'}
                    color={'#EBB2B9'}>
                    {'Next >'}
                </Button>
            </Box>
        </Box>
    );
};
