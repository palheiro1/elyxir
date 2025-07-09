import { Select, Stack } from '@chakra-ui/react';

const optionStyle = { backgroundColor: '#FFF', color: '#000' };

const FilterSelects = ({
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

export default FilterSelects;
