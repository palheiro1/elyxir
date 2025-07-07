import { Overlay } from '../BattlegroundsIntro/Overlay';
import { Box, Button, IconButton, Stack, useSteps } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import QuickStartStep from './QuickStartStep';
import { useRef } from 'react';

const steps = [
    {
        title: 'Deposit your cards and GEM',
        imageSrc: 'images/battlegrounds/tutorial/depositCards.svg',
        texts: [
            'Choose the best combinations of cards to build your army.',
            'Tip: use cards from the same environment or continent to get combat bonuses.',
        ],
    },
    {
        title: 'Decide where to attack',
        imageSrc: 'images/battlegrounds/tutorial/attack.svg',
        texts: [
            'Common lands are easier, but epic lands offer greater rewards.',
            'Every battle is a strategic challenge, not a matter of brute force.',
        ],
    },
    {
        title: 'Fight and win',
        imageSrc: 'images/battlegrounds/tutorial/fight.svg',
        texts: [
            'Your army will automatically face the Guardian of the land.',
            '🏆 If you win, you will gain control of the territory, rewards and prestige.',
            '⚠️ If you lose, you could lose one of your cards. Plan well!',
        ],
    },
];

const QuickStartModal = ({ handleClose }) => {
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
