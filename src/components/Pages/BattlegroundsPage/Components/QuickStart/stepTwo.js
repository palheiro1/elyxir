import { Image, Stack, Text } from '@chakra-ui/react';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import tarasca from '../../assets/tarasca.svg';

/**
 * @name stepTwo
 * @description React component that renders the second onboarding step for the Battlegrounds game.
 * It displays an explanatory message about the game's objective and a representative image (Tarasca).
 * The layout adjusts based on the `isMobile` prop for responsive design.
 * @param {Object} props - Component props.
 * @param {boolean} props.isMobile - Flag indicating whether the component is being viewed on a mobile device.
 * @returns {JSX.Element} A responsive layout with a left-side image and a right-side text block describing the game's goal.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const stepTwo = ({ isMobile, setImagesLoaded }) => {
    return (
        <>
            <Stack direction={'row'} m={'auto'} mt={!isMobile ? '5%' : 0}>
                <Image
                    key={tarasca}
                    src={tarasca}
                    w={'40%'}
                    onLoad={() => setImagesLoaded(true)}
                    onError={() => setImagesLoaded(true)}
                />
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
