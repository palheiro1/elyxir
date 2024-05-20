import { Box, Button, Text } from "@chakra-ui/react";
import "@fontsource/chelsea-market"; 
import "@fontsource/inter";

export const PageTwo = ({ handleClose }) => {
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