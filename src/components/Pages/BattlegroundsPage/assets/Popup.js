import { Button, Img, Heading, Text, Box, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import logo from './image.png';

const PageOne = ({ handleNext }) => {
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
                    <strong>Battlegrounds</strong> is the playground for Mythical Beings NFTs. The world is divided into
                    55 territories, each of which can be conquered and defended by a battalion of mythological
                    creatures.
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

const PageTwo = ({ handleClose }) => {
    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <Box>
                <Text
                    color={'#FFF'}
                    fontFamily={'Inter, sans-serif'}
                    fontWeight={'400'}
                    fontSize={'md'}
                    mx={'auto'}
                    mt={'70px'}
                    w={'450px'}
                    textAlign={'justify'}>
                    The object of the game is to carefully select your teams to conquer each territory and maintain
                    control for as long as possible. The more territories you control, and the longer you hold them, the
                    more points you score and the higher you climb on the leaderboard.
                </Text>
                <Text
                    color={'#FFF'}
                    fontFamily={'Inter, sans-serif'}
                    fontWeight={'400'}
                    fontSize={'md'}
                    mx={'auto'}
                    mt={6}
                    w={'450px'}
                    textAlign={'justify'}>
                    More information can be found in the Guides and FAQ section.
                </Text>
            </Box>

            <Box>
                <Button
                    color={'#EBB2B9'}
                    backgroundColor={'transparent'}
                    mt={5}
                    onClick={handleClose}
                    fontFamily={'Chelsea Market, system-ui'}
                    fontSize={'lg'}
                    fontWeight={'100'}
                    border={'1px solid #EBB2B9'}
                    borderRadius={'50px'}>
                    Start
                </Button>
            </Box>
        </Box>
    );
};

export const Overlay = ({ isVisible, handleClose }) => {
    return (
        isVisible && (
            <Box
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Gris translúcido
                    zIndex: 6, // Asegura que esté encima del resto de la página
                }}
                onClick={handleClose}
            />
        )
    );
};

export const Popup = ({visible, page, handleClose, handleNext}) => {
    return (
        <>
            <Overlay handleClose={handleClose} isVisible={visible} />
            <Box
                visibility={visible ? 'visible' : 'hidden'}
                backgroundColor={'#1F2323'}
                mx={'20%'}
                borderRadius={'30px'}
                w={'600px'}
                h={'350px'}
                position={'absolute'}
                zIndex={10}>
                <IconButton
                    background={'transparent'}
                    color={'#FFF'}
                    icon={<CloseIcon />}
                    _hover={{ background: 'transparent' }}
                    onClick={handleClose}
                    position="absolute"
                    top={2}
                    right={2}
                />

                {page === 1 && <PageOne handleNext={handleNext} />}
                {page === 2 && <PageTwo handleClose={handleClose} />}
            </Box>
        </>
    );
};
