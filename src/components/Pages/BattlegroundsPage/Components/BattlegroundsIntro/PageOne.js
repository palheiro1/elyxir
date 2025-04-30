import { Box, Button, Heading, Image, Img, Stack, Text } from '@chakra-ui/react';
import logo from '../../assets/image.png';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import locations from '../../assets/LocationsEnum';
import welcome1 from '../../assets/wellcome1.svg';
import welcome2 from '../../assets/wellcome2.svg';

export const PageOne = ({ handleNext, isMobile }) => {
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
                fontSize={isMobile ? 'small' : 'large'}>
                <Text mt={8}>Welcome to</Text> <Img src={logo} w={isMobile ? '50%' : '85%'} mx={'auto'} />
            </Stack>
            <Box w={'100%'}>
                <Heading
                    color={'#FFF'}
                    fontFamily={'Chelsea Market, system-ui'}
                    textTransform={'uppercase'}
                    size={isMobile ? 'sm' : 'md'}
                    textAlign={'center'}
                    mt={7}
                    fontWeight={'100'}
                    mx={'auto'}
                    w={isMobile ? '300px' : '450px'}>
                    Prepare your creatures and conquer the world!
                </Heading>
                <Stack w={'100%'}>
                    <Text
                        color={'#FFF'}
                        fontFamily={'Inter, sans-serif'}
                        fontWeight={'400'}
                        fontSize={isMobile ? 'xs' : 'md'}
                        mx={!isMobile && 'auto'}
                        ml={isMobile && '0'}
                        mt={6}
                        w={isMobile ? '400px' : '500px'}
                        textAlign={'justify'}>
                        <strong>Battlegrounds</strong> is the playground for Mythical Beings NFTs. The world is divided
                        into {locations.length} territories, each of which can be conquered and defended by a battalion
                        of mythological creatures.{' '}
                    </Text>
                    <Button
                        colorScheme="transparent"
                        p={0}
                        mt={isMobile && -2}
                        fontSize={isMobile && 'sm'}
                        mx={'auto'}
                        onClick={handleNext}
                        fontFamily={'Chelsea Market, system-ui'}
                        color={'#EBB2B9'}>
                        {'Next >'}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};
