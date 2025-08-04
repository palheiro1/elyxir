import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton, Stack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import BattleRound from './BattleRound';

/**
 * @name BattleRounds
 * @description Renders a horizontally scrollable list of all battle rounds for a given battle.
 * Includes navigation arrows to scroll left or right and dynamically enables/disables them based on scroll position.
 * @param {Object} props - Component props.
 * @param {Object} props.battleResults - Object containing all battle round data, including `battleResult` array.
 * @param {Object} props.battleInfo - General metadata about the battle (e.g., winner, round count).
 * @param {Object} props.attackerHero - Hero data for the attacker.
 * @param {Object} props.attackerBonus - Bonus effects applied to the attacker.
 * @param {Object} props.defenderHero - Hero data for the defender.
 * @param {Object} props.defenderBonus - Bonus effects applied to the defender.
 * @param {string|number} props.battleId - Unique identifier of the battle.
 * @param {boolean} props.isMobile - Whether the UI is being rendered on a mobile device.
 * @param {boolean} props.isMediumScreen - Whether the screen is in medium-width breakpoint (used to determine scroll behavior).
 * @returns {JSX.Element} A responsive horizontally scrollable stack of `<BattleRound />` components with arrow navigation.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleRounds = ({
    battleResults,
    battleInfo,
    attackerHero,
    attackerBonus,
    defenderHero,
    defenderBonus,
    battleId,
    isMobile,
    isMediumScreen,
}) => {
    const [arrowDisable, setArrowDisable] = useState(true);
    const [arrowRigthDisable, setArrowRigthDisable] = useState(false);
    const elementRef = useRef(null);
    const handleHorizantalScroll = (element, speed, distance, step) => {
        const maxScrollLeft = element.scrollWidth - element.clientWidth;
        let scrollAmount = 0;
        const slideTimer = setInterval(() => {
            element.scrollLeft += step;
            scrollAmount += Math.abs(step);

            if (scrollAmount >= distance) {
                clearInterval(slideTimer);
            }

            if (element.scrollLeft === 0) {
                setArrowDisable(true);
            } else {
                setArrowDisable(false);
            }

            if (element.scrollLeft >= maxScrollLeft) {
                setArrowRigthDisable(true);
            } else {
                setArrowRigthDisable(false);
            }
        }, speed);
    };
    return (
        <Stack
            direction={isMobile ? 'column' : 'row'}
            mx={'auto'}
            w={'90%'}
            h={'60%'}
            className="custom-scrollbar"
            overflowX={'scroll'}
            overflowY={isMediumScreen ? 'hidden' : 'auto'}
            ref={elementRef}
            spacing={4}>
            <IconButton
                position="absolute"
                left="2"
                icon={<ChevronLeftIcon />}
                top="50%"
                color={'black'}
                isDisabled={arrowDisable}
                transform="translateY(-50%)"
                zIndex="1"
                onClick={() => {
                    handleHorizantalScroll(elementRef.current, 10, 400, -5);
                }}
                bg="rgba(255, 255, 255, 0.8)"
                _hover={{ bg: 'rgba(255, 255, 255, 1)' }}
                borderRadius={'full'}
                display={isMobile ? 'none' : 'block'}
            />

            {battleResults &&
                battleResults.battleResult.map((item, index) => (
                    <BattleRound
                        key={index}
                        index={index}
                        item={item}
                        battleInfo={battleInfo}
                        attackerHero={attackerHero}
                        attackerBonus={attackerBonus}
                        defenderHero={defenderHero}
                        defenderBonus={defenderBonus}
                        battleId={battleId}
                        isMobile={isMobile}
                    />
                ))}
            <IconButton
                position="absolute"
                right="2"
                top="50%"
                icon={<ChevronRightIcon />}
                bgColor={'transparent'}
                color={'black'}
                transform="translateY(-50%)"
                zIndex="1"
                isDisabled={arrowRigthDisable}
                borderRadius={'full'}
                onClick={() => {
                    handleHorizantalScroll(elementRef.current, 10, 200, 5);
                }}
                bg="rgba(255, 255, 255, 0.8)"
                _hover={{ bg: 'rgba(255, 255, 255, 1)' }}
                display={isMobile ? 'none' : 'block'}
            />
        </Stack>
    );
};

export default BattleRounds;
