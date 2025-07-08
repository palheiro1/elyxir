import { Image, Stack, Text } from '@chakra-ui/react';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import tarasca from '../../assets/tarasca.svg';

const stepTwo = ({ isMobile }) => {
    return (
        <>
            <Stack direction={'row'} m={'auto'} mt={!isMobile ? '5%' : 0}>
                <Image src={tarasca} w={'40%'} />
                <Stack direction={'column'} w={'60%'} my={'auto'}>
                    <Text
                        color={'#FFF'}
                        fontFamily={'Inter, sans-serif'}
                        fontWeight={'400'}
                        fontSize={isMobile ? 'sm' : 'md'}
                        mx={'auto'}
                        w={'90%'}
                        textAlign={'justify'}>
                        The object of the game is to carefully select your teams to conquer each territory and maintain
                        control for as long as possible. The more territories you control, and the longer you hold them,
                        the more points you score and the higher you climb on the leaderboard.
                    </Text>
                    <Text
                        color={'#FFF'}
                        fontFamily={'Inter, sans-serif'}
                        fontWeight={'400'}
                        fontSize={isMobile ? 'sm' : 'md'}
                        mx={'auto'}
                        w={'90%'}
                        textAlign={'justify'}>
                        More information can be found in the Guides and FAQ section.
                    </Text>
                </Stack>
            </Stack>
        </>
    );
};

export default stepTwo;
