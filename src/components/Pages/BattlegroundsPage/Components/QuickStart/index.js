import { Overlay } from '../BattlegroundsIntro/Overlay';
import { Box, Button, IconButton, Stack, useSteps } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import QuickStartStep from './QuickStartStep';
import { useRef } from 'react';
import { QuickStartSteps } from './data';

/**
 * @name QuickStartModal
 * @description Modal component displaying a step-by-step quick start tutorial for the Battlegrounds game. Uses an overlay and a scrollable box with navigation buttons to guide users through deposit, attack, and fight steps. Closes when tutorial is finished or dismissed.
 * @param {Function} handleClose - Callback function to close the modal.
 * @returns {JSX.Element} A modal overlay with tutorial steps and navigation controls.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const QuickStartModal = ({ handleClose }) => {
    const steps = QuickStartSteps;
    const { activeStep: step, goToNext } = useSteps({ index: 0, count: steps.length });
    const modalRef = useRef(null);

    const handleNext = () => {
        if (step < steps.length - 1) {
            modalRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            goToNext();
        } else {
            handleClose();
        }
    };

    return (
        <>
            <Overlay isVisible handleClose={handleClose} />
            <Box
                ref={modalRef}
                pos="fixed"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                w="65%"
                h="90%"
                bg="#1F2323"
                borderRadius="25px"
                zIndex={99}
                overflowY="scroll"
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
                    w="90%"
                    mx="auto"
                    mt={5}
                    spacing={8}
                    align="center"
                    justify="space-between"
                    textAlign="center">
                    <Box w="100%" p="24px" fontFamily="Ruina">
                        <QuickStartStep {...steps[step]} />

                        <Button
                            onClick={handleNext}
                            fontFamily="Chelsea Market, system-ui"
                            color="#EBB2B9"
                            bg="transparent"
                            _hover={{ bg: 'transparent', opacity: 0.8 }}
                            textDecor={step < steps.length - 1 ? 'none' : 'underline'}
                            fontSize={'lg'}
                            mt={3}>
                            {step < steps.length - 1 ? 'Next >' : 'Start game'}
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </>
    );
};

export default QuickStartModal;
