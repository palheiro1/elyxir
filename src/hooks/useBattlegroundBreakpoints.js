import { useMediaQuery } from '@chakra-ui/react';

/**
 * @name useBattlegroundBreakpoints
 * @description Custom hook that provides responsive breakpoint flags for the Battlegrounds UI. It detects
 * if the screen is considered mobile or medium-sized based on specific width ranges.
 * @returns {Object} Object containing:
 * - `isMobile`: {boolean} True if the viewport width is less than or equal to 1179px.
 * - `isMediumScreen`: {boolean} True if the viewport width is between 1180px and 1400px.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const useBattlegroundBreakpoints = () => {
    const [isMobile] = useMediaQuery('(max-width: 1179px)');
    const [isMediumScreen] = useMediaQuery('(min-width: 1180px) and (max-width: 1400px)');
    const [isLittleScreen] = useMediaQuery('(min-width: 1180px) and (max-width: 1399px)');
    return {
        isMobile,
        isMediumScreen,
        isLittleScreen,
    };
};
