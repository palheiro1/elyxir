// components/CardFilters.js
import { Select, Stack } from '@chakra-ui/react';

const selectStyle = { backgroundColor: '#FFF', color: '#000' };

/**
 * @name CardFilters
 * @description Renders a responsive set of dropdown filters for card selection based on rarity, element, and domain.
 * Adapts layout width for mobile and desktop. Calls corresponding handler functions when filters change.
 * @param {Object} props - Component props.
 * @param {boolean} props.isMobile - Whether the component is rendered in mobile view.
 * @param {function} props.handleRarityChange - Callback to handle rarity selection changes.
 * @param {function} props.handleElementChange - Callback to handle element selection changes.
 * @param {function} props.handleDomainChange - Callback to handle domain/continent selection changes.
 * @returns {JSX.Element} Filter controls for card browsing by rarity, element, and domain.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CardFilters = ({ isMobile, handleRarityChange, handleElementChange, handleDomainChange }) => (
  <Stack direction="row" fontFamily="Chelsea Market, system-ui" ml={!isMobile && '10'}>
    <Select w={isMobile ? '15%' : '10%'} onChange={handleRarityChange} color="#FFF">
      <option value="-1" style={selectStyle}>Rarity</option>
      <option value="1" style={selectStyle}>Common</option>
      <option value="2" style={selectStyle}>Rare</option>
      <option value="3" style={selectStyle}>Epic</option>
      <option value="4" style={selectStyle}>Special</option>
    </Select>
    <Select w={isMobile ? '20%' : '10%'} onChange={handleElementChange} color="#FFF">
      <option value="-1" style={selectStyle}>Element</option>
      <option value="1" style={selectStyle}>Terrestrial</option>
      <option value="2" style={selectStyle}>Aerial</option>
      <option value="3" style={selectStyle}>Aquatic</option>
    </Select>
    <Select w={isMobile ? '20%' : '10%'} onChange={handleDomainChange} color="#FFF">
      <option value="-1" style={selectStyle}>Continent</option>
      <option value="1" style={selectStyle}>Asia</option>
      <option value="2" style={selectStyle}>Oceania</option>
      <option value="3" style={selectStyle}>America</option>
      <option value="4" style={selectStyle}>Africa</option>
      <option value="5" style={selectStyle}>Europe</option>
    </Select>
  </Stack>
);

export default CardFilters;
