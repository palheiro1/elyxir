import { Overlay } from './BattlegroundsIntro/Overlay';
import { Box, Button, IconButton, Image, Stack, Text } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import logo from '../assets/image.png';

const NewPlayersModal = ({ handleClose, setOpenInventory }) => {
    const handeOpenInventory = () => {
        setOpenInventory(true);
        handleClose();
    };
    return (
        <>
            <Overlay isVisible handleClose={handleClose} />
            <Box
                pos="fixed"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                w="65%"
                h="90%"
                bg="#1F2323"
                borderRadius="25px"
                zIndex={99}
                overflowY="hidden"
                className="custom-scrollbar">
                <IconButton
                    icon={<CloseIcon />}
                    onClick={handleClose}
                    aria-label="Close Quick Start Modal"
                    position="absolute"
                    top={2}
                    right={2}
                    zIndex={999}
                    color="#FFF"
                    bg="transparent"
                    _hover={{ bg: 'transparent' }}
                />

                <Stack
                    direction="column"
                    w="100%"
                    h={'100%'}
                    m="auto"
                    spacing={8}
                    align="center"
                    justify="center"
                    textAlign="center"
                    fontFamily="'Chelsea Market', system-ui"
                    p={'24px'}>
                    <Text fontSize={'2xl'}>Welcome to</Text>
                    <Image src={logo} />
                    <Text fontSize={'3xl'} textTransform={'uppercase'} fontWeight={'light'} letterSpacing={'wide'}>
                        You currently have no cards in battlegrounds
                    </Text>
                    <Text fontSize={'2xl'}>
                        To start you have to deposit some cards to be able to conquer some land
                    </Text>
                    <Button
                        onClick={handeOpenInventory}
                        fontFamily="Chelsea Market, system-ui"
                        color="#EBB2B9"
                        bg="transparent"
                        _hover={{ bg: 'transparent', opacity: 0.8 }}
                        fontSize={'lg'}
                        mt={3}>
                        {'Next >'}
                    </Button>
                </Stack>
            </Box>
        </>
    );
};

export default NewPlayersModal;
