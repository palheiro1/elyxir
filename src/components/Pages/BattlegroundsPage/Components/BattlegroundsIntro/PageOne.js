import { Box, Button, Heading, Img, Text } from '@chakra-ui/react';
import logo from '../../assets/image.png';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import locations from '../../assets/LocationsEnum';

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
            <Heading
                fontFamily={'Chelsea Market, system-ui'}
                color={'#FFF'}
                display={'flex'}
                mt={7}
                fontWeight={'100'}
                size={'md'}>
                <Text mt={8}>Wellcome to</Text> <Img src={logo} w={'114px'} h={'54px'} ml={4} />
            </Heading>
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
                    mt={7}
                    onClick={handleNext}
                    fontFamily={'Chelsea Market, system-ui'}
                    color={'#EBB2B9'}>
                    {'Next >'}
                </Button>
            </Box>
        </Box>
    );
};
