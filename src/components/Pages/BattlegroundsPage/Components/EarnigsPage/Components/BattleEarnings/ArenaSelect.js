import { GridItem, Select } from '@chakra-ui/react';

/**
 * @name ArenaSelect
 * @description Component that renders a responsive dropdown menu for selecting a battle arena. 
 * It displays the list of available arenas and updates the selected value on change.
 * @param {Object} props - Component props.
 * @param {number} props.selectedArena - Currently selected arena ID.
 * @param {Function} props.setSelectedArena - Setter function to update selected arena.
 * @param {Array} props.arenas - Array of arena objects containing `arenaId` and `name`.
 * @param {boolean} props.isMobile - Determines font size based on screen size.
 * @returns {JSX.Element} Rendered Chakra UI Select component wrapped in a GridItem.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const ArenaSelect = ({ selectedArena, setSelectedArena, arenas, isMobile }) => (
    <GridItem colSpan={1} textAlign="center" my="auto">
        <Select
            variant="unstyled"
            value={selectedArena}
            onChange={e => setSelectedArena(Number(e.target.value))}
            textAlign="center"
            textTransform="uppercase"
            fontFamily="Inter, System"
            fontWeight={700}
            fontSize={isMobile ? 'sm' : 'md'}
            mx="auto">
            {arenas?.map(arena => (
                <option key={arena.arenaId} value={arena.arenaId} style={{ backgroundColor: '#FFF', color: '#000' }}>
                    {arena.name}
                </option>
            ))}
        </Select>
    </GridItem>
);

export default ArenaSelect;
