import { Box, Image } from '@chakra-ui/react';
import ResponsiveTooltip from '../../../../../../ui/ReponsiveTooltip';
import { useSelector } from 'react-redux';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';
import { domainMapping, mediumMapping } from '../../../../../../Items/data';

/**
 * @name UsedPotion
 * @description  React component that displays a potion currently used by the attacker in a battleground match.
 * It retrieves potion data from the Redux `items` state, matches it by `potionAsset`,
 * and shows its image with a tooltip describing the potion's bonus effect.
 * - If the potion bonus is of type `medium`, it maps the value using `mediumMapping`.
 * - If the potion bonus is of type `domain`, it maps the value using `domainMapping`.
 * - The tooltip provides details about the potion type, mapped value, and its power boost.
 * - The component adapts styles and positioning based on device size (mobile vs desktop).
 * @param {Object} props - Component props.
 * @param {string} props.potionAsset - Asset ID of the potion used by the attacker.
 * @returns {JSX.Element|undefined} A positioned image of the potion with tooltip, or nothing if no potion is found.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const UsedPotion = ({ potionAsset }) => {
    const { isMobile } = useBattlegroundBreakpoints();
    const { items } = useSelector(state => state.items);

    const usedPotion = items.find(item => item.asset === potionAsset);
    if (!usedPotion) return;

    let bonusText;
    if (usedPotion.bonus.type === 'medium') bonusText = 'Medium: ' + mediumMapping[usedPotion.bonus.value];
    else if (usedPotion.bonus.type === 'domain') bonusText = 'Domain: ' + domainMapping[usedPotion.bonus.value];

    return (
        <Box position="absolute" top={isMobile ? '50px' : '80px'} left={6}>
            <ResponsiveTooltip
                label={`Potion used by the attacker: \n · ${usedPotion.description} \n · ${bonusText}. \n· Power: +${usedPotion.bonus.power} for matching cards`}>
                <Image
                    src={usedPotion.imgUrl}
                    fallbackSrc="/images/items/WaterCristaline copia.png"
                    boxSize={isMobile ? '50px' : '60px'}
                    borderRadius="md"
                    border="3px solid #D597B2"
                    shadow="0 0 10px rgba(213, 151, 178, 0.5)"
                />
            </ResponsiveTooltip>
        </Box>
    );
};

export default UsedPotion;
