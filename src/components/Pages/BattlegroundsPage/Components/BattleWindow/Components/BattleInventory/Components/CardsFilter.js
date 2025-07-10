import { Select, Stack } from '@chakra-ui/react';

const optionStyle = { backgroundColor: '#FFF', color: '#000' };

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
}) => (
    <Stack direction="row" fontFamily={'Chelsea Market, system-ui'} ml={'9%'}>
        <Select w={isMobile ? '25%' : '10%'} onChange={handleRarityChange} color={'#FFF'} defaultValue={filters.rarity}>
            <option value="-1" style={optionStyle}>
                Rarity
            </option>
            {level === 1 ? (
                <>
                    <option value="1" style={optionStyle}>
                        Common
                    </option>
                    <option value="2" style={optionStyle}>
                        Rare
                    </option>
                </>
            ) : index !== 0 ? (
                <>
                    <option value="1" style={optionStyle}>
                        Common
                    </option>
                    <option value="2" style={optionStyle}>
                        Rare
                    </option>
                </>
            ) : (
                <>
                    <option value="3" style={optionStyle}>
                        Epic
                    </option>
                    <option value="4" style={optionStyle}>
                        Special
                    </option>
                </>
            )}
        </Select>

        <Select
            w={isMobile ? '25%' : '10%'}
            onChange={handleElementChange}
            color={'#FFF'}
            defaultValue={filters.element}>
            <option value="-1" style={optionStyle}>
                Element
            </option>
            <option value="1" style={optionStyle}>
                Terrestrial
            </option>
            <option value="2" style={optionStyle}>
                Aerial
            </option>
            <option value="3" style={optionStyle}>
                Aquatic
            </option>
        </Select>

        <Select w={isMobile ? '25%' : '10%'} onChange={handleDomainChange} color={'#FFF'} defaultValue={filters.domain}>
            <option value="-1" style={optionStyle}>
                Continent
            </option>
            <option value="1" style={optionStyle}>
                Asia
            </option>
            <option value="2" style={optionStyle}>
                Oceania
            </option>
            <option value="3" style={optionStyle}>
                America
            </option>
            <option value="4" style={optionStyle}>
                Africa
            </option>
            <option value="5" style={optionStyle}>
                Europe
            </option>
        </Select>
    </Stack>
);

export default CardsFilter;
