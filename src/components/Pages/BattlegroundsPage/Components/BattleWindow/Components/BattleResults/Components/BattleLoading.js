import { Box } from '@chakra-ui/react';
import Lottie from 'react-lottie';
import animationData from '../../../../../assets/Animation-1720173159051.json';

/**
 * @name BattleLoading
 * @description Displays a centered loading animation and message indicating that a battle is in progress.
 * Uses a Lottie animation to provide visual feedback while waiting for the next block to resolve the battle.
 * @returns {JSX.Element} A full-screen, centered animation and message indicating that the battle is processing.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleLoading = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <Box
            position="absolute"
            left="50%"
            top="50%"
            transform="translate(-50%, -50%)"
            fontFamily="Chelsea Market, system-ui"
            fontSize="larger"
            color="#FFF"
            textAlign="center">
            <Lottie options={defaultOptions} height={150} width={150} />
            Battle in progress...
            <br />
            Results appear after the next block
        </Box>
    );
};

export default BattleLoading;
