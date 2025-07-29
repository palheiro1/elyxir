import { CloseIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    IconButton,
    Select,
    Stack,
    useDisclosure,
} from '@chakra-ui/react';
import { domainFilterOptions, elementFilterOptions, rarityFilterOptions } from '../data';

/**
 * @name CardFilters
 * @description Renders a responsive set of dropdown filters for card selection based on rarity, element, and domain.
 * Shows a filter button on mobile that opens a drawer with the filter options. On desktop, filters are shown inline.
 * @param {Object} props - Component props.
 * @param {boolean} props.isMobile - Whether the component is rendered in mobile view.
 * @param {function} props.handleRarityChange - Callback to handle rarity selection changes.
 * @param {function} props.handleElementChange - Callback to handle element selection changes.
 * @param {function} props.handleDomainChange - Callback to handle domain/continent selection changes.
 * @returns {JSX.Element} Filter controls for card browsing by rarity, element, and domain.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CardFilters = ({
    isMobile,
    filters,
    handleRarityChange,
    handleElementChange,
    handleDomainChange,
    handleResetFilters,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const selectStyle = {
        backgroundColor: '#FFF',
        color: '#000',
    };

    const showResetButton = filters.rarity !== '-1' || filters.element !== '-1' || filters.domain !== '-1';

    const Filters = () => (
        <Stack direction={isMobile ? 'column' : 'row'} spacing={2} fontFamily="Chelsea Market, system-ui">
            <Select w={isMobile && '100%'} value={filters.rarity} onChange={handleRarityChange} color="#FFF">
                {rarityFilterOptions.map(({ name, value }, index) => (
                    <option value={value} style={selectStyle} key={index}>
                        {name}
                    </option>
                ))}
            </Select>
            <Select w={isMobile && '100%'} value={filters.element} onChange={handleElementChange} color="#FFF">
                {elementFilterOptions.map(({ name, value }, index) => (
                    <option value={value} style={selectStyle} key={index}>
                        {name}
                    </option>
                ))}
            </Select>
            <Select w={isMobile && '100%'} value={filters.domain} onChange={handleDomainChange} color="#FFF">
                {domainFilterOptions.map(({ name, value }, index) => (
                    <option value={value} style={selectStyle} key={index}>
                        {name}
                    </option>
                ))}
            </Select>
        </Stack>
    );

    return isMobile ? (
        <>
            <Button
                onClick={onOpen}
                size="sm"
                fontFamily="Chelsea Market, system-ui"
                p={1}
                w="100px"
                top={2}
                left={2}
                position="absolute">
                Filters
            </Button>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose} trapFocus={false}>
                <DrawerOverlay />
                <DrawerContent bg="#1F2323" color="#FFF" fontFamily="Chelsea Market, system-ui">
                    <DrawerHeader>Filters</DrawerHeader>
                    <DrawerBody>
                        <Filters />
                    </DrawerBody>
                    <DrawerFooter>
                        {showResetButton && (
                            <Button color={'#FFF'} onClick={handleResetFilters}>
                                Reset
                            </Button>
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    ) : (
        <Box ml="10" display={'flex'} flexDirection={'row'} fontFamily="Chelsea Market, system-ui">
            <Filters />
            {showResetButton && <IconButton color={'#FFF'} icon={<CloseIcon />} onClick={handleResetFilters} ml={2} />}
        </Box>
    );
};

export default CardFilters;
