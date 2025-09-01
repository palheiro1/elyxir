import { Box, Image } from '@chakra-ui/react';
import ResponsiveTooltip from '../../../../../../ui/ReponsiveTooltip';
import { useSelector } from 'react-redux';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';
import { domainMapping, mediumMapping } from '../../../../../../Items/data';

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
                label={`Potion used by the attacker: \n ${bonusText}. \nPower: +${usedPotion.bonus.power} for matching cards`}>
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
