import { useRef, useState } from 'react';
import { Stack, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import BattleRound from './BattleRound';

/**
 * @name BattleRounds
 * @description Displays a horizontally scrollable list of battle rounds using the `BattleRound` component.
 * Includes left and right navigation buttons to scroll through the content manually.
 * Automatically enables or disables arrows based on scroll position.
 * @param {Object} props
 * @param {Array} props.battleResults - Array of round data to be displayed. Each round includes attacker/defender info and values.
 * @param {Object} [props.attackerBonus] - Optional bonus data for attacker cards.
 * @param {Object} [props.defenderBonus] - Optional bonus data for defender cards.
 * @param {Array} [props.cards] - All user cards to reference in the battle rounds.
 * @param {Object} [props.battleInfo] - Full battle metadata (used inside BattleRound if needed).
 * @param {Object} [props.soldiers] - Soldier stats for card lookup.
 * @param {Object} [props.attackerHero] - Attacker hero card metadata.
 * @param {Object} [props.defenderHero] - Defender hero card metadata.
 * @returns {JSX.Element} Horizontal scrollable stack of battle rounds with scroll arrows.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleRounds = ({ battleResults, ...props }) => {
    const elementRef = useRef(null);
    const [arrowLeftDisable, setArrowLeftDisable] = useState(true);
    const [arrowRightDisable, setArrowRightDisable] = useState(false);

    const handleScroll = (element, speed, distance, step) => {
        const maxScrollLeft = element.scrollWidth - element.clientWidth;
        let scrollAmount = 0;

        const slideTimer = setInterval(() => {
            element.scrollLeft += step;
            scrollAmount += Math.abs(step);

            if (scrollAmount >= distance) {
                clearInterval(slideTimer);
            }

            setArrowLeftDisable(element.scrollLeft === 0);
            setArrowRightDisable(element.scrollLeft >= maxScrollLeft);
        }, speed);
    };

    return (
        <>
            <IconButton
                position="absolute"
                left="2"
                icon={<ChevronLeftIcon />}
                top="50%"
                color="black"
                isDisabled={arrowLeftDisable}
                transform="translateY(-50%)"
                zIndex="1"
                onClick={() => handleScroll(elementRef.current, 10, 200, -5)}
                bg="rgba(255, 255, 255, 0.8)"
                _hover={{ bg: 'rgba(255, 255, 255, 1)' }}
                borderRadius="full"
            />
            <Stack
                direction="row"
                mx="auto"
                w="90%"
                h="60%"
                className="custom-scrollbar"
                overflowX="scroll"
                overflowY="hidden"
                ref={elementRef}
                spacing={4}
                position="relative">
                {battleResults.map((round, index) => (
                    <BattleRound key={index} round={round} index={index} {...props} />
                ))}
            </Stack>
            <IconButton
                position="absolute"
                right="2"
                top="50%"
                icon={<ChevronRightIcon />}
                color="black"
                transform="translateY(-50%)"
                zIndex="1"
                isDisabled={arrowRightDisable}
                borderRadius="full"
                onClick={() => handleScroll(elementRef.current, 10, 200, 5)}
                bg="rgba(255, 255, 255, 0.8)"
                _hover={{ bg: 'rgba(255, 255, 255, 1)' }}
            />
        </>
    );
};

export default BattleRounds;
