import { Button, Image, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from '@chakra-ui/react';
import { mediumFilterOptions, rarityFilterOptions } from '../data';
import { MdOutlineArrowDropDown } from 'react-icons/md';
import { getLevelIconInt, getMediumIconInt } from '../Utils/BattlegroundsUtils';

/**
 * @name BattlegroundFilters
 * @description Renders dropdown filters for selecting rarity and medium (element) to filter battleground lands.
 * Displays icons and names for selected values, and handles selection changes via callback.
 * @param {Object} props - Props object.
 * @param {boolean} props.isMobile - Indicates if the layout is mobile to adapt min width for dropdowns.
 * @param {Object} props.filters - Current filters applied. Includes:
 * @param {number} filters.rarity - Selected rarity filter value. `-1` means "All".
 * @param {number} filters.element - Selected element (medium) filter value. `-1` means "All".
 * @param {Function} props.handleFilterChange - Callback triggered when the user selects a new filter.
 * @param {string} key - Filter key ('rarity' or 'element').
 * @param {number} value - New selected value.
 * @returns {JSX.Element} A horizontal `Stack` of dropdown menus to filter battleground lands by rarity and element.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattlegroundFilters = ({ isMobile, filters, handleFilterChange }) => {
    return (
        <Stack direction="row" color="#FFF" zIndex={3} mt={isMobile && 3}>
            {/* Rarity Filter */}
            <Text my="auto" fontSize="md" fontWeight={500} mx={3}>
                Lands
            </Text>
            <Menu>
                <MenuButton as={Button} w="160px" bg="transparent" pr={0}>
                    <Stack direction="row" justifyContent="end" w="100%">
                        <Stack direction="row" color="#FFF">
                            <Text fontSize="md" fontWeight={500} w="80px">
                                {rarityFilterOptions[filters.rarity]?.name || 'Rarity'}
                            </Text>
                            <MdOutlineArrowDropDown size={20} />
                            {filters.rarity !== -1 && (
                                <Image
                                    boxSize="20px"
                                    src={getLevelIconInt(rarityFilterOptions[filters.rarity]?.value)}
                                />
                            )}
                        </Stack>
                    </Stack>
                </MenuButton>
                <MenuList bg="#202323" border="none">
                    {rarityFilterOptions.map(({ name, value }) => (
                        <MenuItem bg="#202323" key={value} onClick={() => handleFilterChange('rarity', value)}>
                            <Stack direction="row">
                                {value !== -1 && <Image boxSize="20px" src={getLevelIconInt(value)} />}
                                <Text mx={value === -1 && 'auto'}>{name}</Text>
                            </Stack>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>

            {/* Element Filter */}
            <Menu>
                <MenuButton as={Button} bg="transparent" w={'160px'} pr={0}>
                    <Stack direction="row" justifyContent="end" w="100%">
                        <Stack direction="row" color="#FFF">
                            <Text fontSize="md" fontWeight={500} w={'80px'}>
                                {mediumFilterOptions[filters.element]?.name || 'Medium'}
                            </Text>
                            <MdOutlineArrowDropDown size={20} />
                            {filters.element !== -1 && (
                                <Image
                                    boxSize="20px"
                                    src={getMediumIconInt(mediumFilterOptions[filters.element]?.value)}
                                />
                            )}
                        </Stack>
                    </Stack>
                </MenuButton>
                <MenuList bg="#202323">
                    {mediumFilterOptions.map(({ name, value }) => (
                        <MenuItem bg="#202323" key={value} onClick={() => handleFilterChange('element', value)}>
                            <Stack direction="row">
                                {value !== -1 && <Image boxSize="20px" src={getMediumIconInt(value)} />}
                                <Text mx={value === -1 && 'auto'}>{name}</Text>
                            </Stack>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </Stack>
    );
};

export default BattlegroundFilters;
