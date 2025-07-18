import { Box, Heading, Image, Img, Stack, Text } from '@chakra-ui/react';
import logo from '../../assets/image.png';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import locations from '../../assets/LocationsEnum';
import welcome1 from '../../assets/wellcome1.svg';
import welcome2 from '../../assets/wellcome2.svg';

/**
 * @name StepOne
 * @description Onboarding welcome screen component for Battlegrounds. Displays introductory text,
 *              logo, background images and description of the game, adapting layout for mobile or desktop.
 * @param {Object} props - Component props.
 * @param {boolean} props.isMobile - Flag indicating whether the component is being rendered on a mobile screen.
 * @returns {JSX.Element} The rendered onboarding step component.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const stepOne = ({ isMobile, setImagesLoaded }) => {
    return (
        <>
            <Image
                key={welcome1}
                src={welcome1}
                position={'absolute'}
                top={0}
                left={0}
                h={'50%'}
                onLoad={() => setImagesLoaded(true)}
                onError={() => setImagesLoaded(true)}
            />
            <Image
                src={welcome2}
                key={welcome2}
                position={'absolute'}
                bottom={0}
                right={0}
                h={'60%'}
                onLoad={() => setImagesLoaded(true)}
                onError={() => setImagesLoaded(true)}
            />
            <Stack
                h={'100%'}
                fontFamily={'Chelsea Market, system-ui'}
                color={'#FFF'}
                display={'flex'}
                mt={!isMobile && '5%'}
                direction={'column'}
                fontWeight={'100'}
                fontSize={isMobile ? 'small' : 'large'}>
                <Text mt={8}>Welcome to</Text> <Img src={logo} w={!isMobile ? '30%' : '20%'} mx={'auto'} />
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
                        ml={isMobile && '0'}
                        mt={!isMobile ? 6 : 3}
                        w={isMobile ? '400px' : '500px'}
                        mx={'auto'}
                        textAlign={'justify'}>
                        <strong>Battlegrounds</strong> is the playground for Mythical Beings NFTs. The world is divided
                        into {locations.length} territories, each of which can be conquered and defended by a battalion
                        of mythological creatures.{' '}
                    </Text>
                </Stack>
            </Box>
        </>
    );
};

export default stepOne;
