import { Overlay } from '../../../../ui/Overlay';
import { Box, Button, IconButton, Image, Stack, Text } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import logo from '../../assets/image.png';
import { useBattlegroundBreakpoints } from '../../../../../hooks/useBattlegroundBreakpoints';

/**
 * @name NewPlayersModal
 * @description Modal component shown to new players who don't have any cards in Battlegrounds. Encourages them to deposit cards by opening the inventory.
 * @param {Function} handleClose - Function to close the modal.
 * @param {Function} setOpenInventory - Setter to open the inventory interface.
 * @returns {JSX.Element} A styled modal with instructions for new players and a button to open the inventory.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const NewPlayersModal = ({ handleClose, setOpenInventory, setHasSeenNewPlayersModal }) => {
    const { isMobile } = useBattlegroundBreakpoints();
    const handeOpenInventory = () => {
        setOpenInventory(true);
        handleClose();
        setHasSeenNewPlayersModal(true);
    };

    const handleCloseButtonClick = () => {
        handleClose();
        setHasSeenNewPlayersModal(true);
    };

    return (
        <>
            <Overlay isVisible handleClose={handleCloseButtonClick} />
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
                className="custom-scrollbar">
                <IconButton
                    icon={<CloseIcon />}
                    onClick={handleCloseButtonClick}
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
                    spacing={isMobile ? 4 : 8}
                    align="center"
                    justify="center"
                    overflowY="auto"
                    textAlign="center"
                    fontFamily="'Chelsea Market', system-ui"
                    p={'24px'}>
                    <Text fontSize={isMobile ? 'md' : '2xl'}>Welcome to</Text>
                    <Image src={logo} boxSize={isMobile && '130px'} />
                    <Text
                        fontSize={isMobile ? 'xl' : '3xl'}
                        textTransform={'uppercase'}
                        fontWeight={'light'}
                        letterSpacing={'wide'}>
                        You currently have no cards in battlegrounds
                    </Text>
                    <Text fontSize={isMobile ? 'md' : '2xl'}>
                        To start you have to deposit some cards to be able to conquer some land
                    </Text>
                    <Button
                        onClick={handeOpenInventory}
                        fontFamily="Chelsea Market, system-ui"
                        color="#EBB2B9"
                        bg="transparent"
                        _hover={{ bg: 'transparent', opacity: 0.8 }}
                        fontSize={isMobile ? 'sm' : 'lg'}
                        mt={3}>
                        {'Next >'}
                    </Button>
                </Stack>
            </Box>
        </>
    );
};

export default NewPlayersModal;
