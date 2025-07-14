import { Select, Stack } from '@chakra-ui/react';
import { memo, useMemo } from 'react';
import { DOMAIN_OPTIONS, ELEMENT_OPTIONS, RARITY_OPTIONS } from '../data';
import { renderOptions } from './renderOptions';

/**
 * @name CardsFilter
 * @description Renders three dropdown selectors for filtering cards by rarity, element, and continent.
 * The options adapt based on the arena level and player index:
 * - Rarity filter:
 *    - If arena level is 1 or player is not the first (index !== 0), options are Common and Rare.
 *    - If player is the first (index === 0) and arena level > 1, options are Epic and Special.
 * - Element filter: fixed options for Terrestrial, Aerial, and Aquatic.
 * - Continent filter: fixed options for Asia, Oceania, America, Africa, and Europe.
 * Each select triggers a callback when its value changes.
 * @param {Object} filters - Current filter values { rarity, element, domain }.
 * @param {Function} handleRarityChange - Callback fired when rarity filter changes.
 * @param {Function} handleElementChange - Callback fired when element filter changes.
 * @param {Function} handleDomainChange - Callback fired when continent filter changes.
 * @param {boolean} isMobile - Flag indicating mobile view to adjust widths.
 * @param {number} index - Player index to determine rarity options.
 * @param {number} level - Arena level to determine rarity options.
 * @returns {JSX.Element} A horizontal stack of three styled Select inputs.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CardsFilter = ({
    filters,
    handleRarityChange,
    handleElementChange,
    handleDomainChange,
    isMobile,
    index,
    level,
}) => {
    const width = isMobile ? '25%' : '10%';

    const rarityOptions = useMemo(() => {
        const useBasic = level === 1 || index !== 0;
        return useBasic ? RARITY_OPTIONS.basic : RARITY_OPTIONS.advanced;
    }, [index, level]);

    return (
        <Stack direction="row" fontFamily="Chelsea Market, system-ui" ml="9%">
            <Select w={width} onChange={handleRarityChange} color="#FFF" defaultValue={filters.rarity}>
                {renderOptions('Rarity', rarityOptions)}
            </Select>

            <Select w={width} onChange={handleElementChange} color="#FFF" defaultValue={filters.element}>
                {renderOptions('Element', ELEMENT_OPTIONS)}
            </Select>

            <Select w={width} onChange={handleDomainChange} color="#FFF" defaultValue={filters.domain}>
                {renderOptions('Continent', DOMAIN_OPTIONS)}
            </Select>
        </Stack>
    );
};

export default memo(CardsFilter);
