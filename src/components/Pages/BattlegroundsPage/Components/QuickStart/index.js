import { Box, Button, Center, IconButton, Spinner, Stack, useSteps } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import QuickStartStep from './QuickStartStep';
import { useRef, useState } from 'react';
import { QuickStartSteps } from './data';
import { useBattlegroundBreakpoints } from '../../../../../hooks/useBattlegroundBreakpoints';
import Modal from '../../../../ui/Modal';

/**
 * @name QuickStartModal
 * @description Modal component displaying a step-by-step quick start tutorial for the Battlegrounds game.
 * Uses an overlay and a scrollable box with navigation buttons to guide users through deposit, attack,
 * and fight steps. Closes when tutorial is finished or dismissed.
 * @param {Function} handleClose - Callback function to close the modal.
 * @returns {JSX.Element} A modal overlay with tutorial steps and navigation controls.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const QuickStartModal = ({ handleClose }) => {
    const steps = QuickStartSteps;
    const { activeStep: step, goToNext } = useSteps({ index: 0, count: steps.length });
    const modalRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const { isMobile } = useBattlegroundBreakpoints();
    const handleNext = () => {
        if (step < steps.length - 1) {
            modalRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            setImagesLoaded(false);
            goToNext();
        } else {
            handleClose();
        }
    };

    const CurrentStep = steps[step];

    return (
        <Modal
            width={isMobile ? '100%' : '50%'}
            height={isMobile ? '100%' : '60%'}
            isVisible
            onClose={handleClose}
            showCloseIcon={false}>
            <Box
                position="sticky"
                top={0}
                zIndex={999}
                display="flex"
                justifyContent="flex-end"
                px={2}
                pt={1}
                bg={'transparent'}>
                <IconButton
                    icon={<CloseIcon />}
                    onClick={handleClose}
                    aria-label="Close Quick Start Modal"
                    color="#FFF"
                    bg="transparent"
                    _hover={{ bg: 'transparent' }}
                />
            </Box>

            {!imagesLoaded && (
                <Center boxSize={'100%'} pos="fixed" top={0} left={0} zIndex={99} bgColor={'#1F2323'}>
                    <Spinner size="xl" thickness="4px" speed="0.65s" color="pink.400" />
                </Center>
            )}

            <Stack direction="column" w="90%" mx="auto" align="center" textAlign="center" fontFamily="Ruina">
                <Box w="100%">
                    {typeof CurrentStep === 'function' ? (
                        <CurrentStep isMobile={isMobile} setImagesLoaded={setImagesLoaded} />
                    ) : (
                        <QuickStartStep {...CurrentStep} isMobile={isMobile} setImagesLoaded={setImagesLoaded} />
                    )}
                </Box>
                <Button
                    onClick={handleNext}
                    fontFamily="Chelsea Market, system-ui"
                    color="#EBB2B9"
                    bgColor="#1F2323"
                    _hover={{ opacity: 0.8 }}
                    textDecor={step < steps.length - 1 ? 'none' : 'underline'}
                    fontSize="lg">
                    {step < steps.length - 1 ? 'Next >' : 'Start game'}
                </Button>
            </Stack>
        </Modal>
    );
};

export default QuickStartModal;
