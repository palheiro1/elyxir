import { Box, Button, Image, Stack, Text } from '@chakra-ui/react';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import tarasca from '../../assets/tarasca.svg';

export const PageTwo = ({ handleClose }) => {
    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <Stack direction={'row'} m={'auto'} mt={'5%'} boxSize={'90%'}>
                <Image src={tarasca} w={'40%'} />
                <Stack direction={'column'} w={'60%'} mt={8}>
                    <Text
                        color={'#FFF'}
                        fontFamily={'Inter, sans-serif'}
                        fontWeight={'400'}
                        fontSize={'md'}
                        m={'auto'}
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
                        fontSize={'md'}
                        m={'auto'}
                        w={'90%'}
                        textAlign={'justify'}>
                        More information can be found in the Guides and FAQ section.
                    </Text>

                    <Box m={'auto'}>
                        <Button
                            color={'#EBB2B9'}
                            backgroundColor={'transparent'}
                            mt={5}
                            onClick={handleClose}
                            fontFamily={'Chelsea Market, system-ui'}
                            fontSize={'lg'}
                            fontWeight={'100'}
                            border={'1px solid #EBB2B9'}
                            letterSpacing={3}
                            borderRadius={'50px'}>
                            Start
                        </Button>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
};
