import Modal from '../../../../ui/Modal';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';
import ItemsPage from './Components/ItemsPage';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Select, Stack, Text } from '@chakra-ui/react';

/**
 * @name ItemsInventory
 * @description React component that renders a modal containing the user's item inventory.
 * It allows switching between sending items to the "Army" (Battlegrounds) or "Inventory" (Ardor).
 * The component adapts its layout dynamically based on screen size breakpoints and displays items
 * in a responsive grid using the `ItemsPage` subcomponent.
 * @param {Object} props - Component props.
 * @param {Object} props.infoAccount - Account information used for displaying and interacting with items.
 * @param {Function} props.onClose - Callback to close the modal.
 * @returns {JSX.Element} A modal containing the item inventory with filtering and transfer options.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */

const ItemsInventory = ({ infoAccount, onClose }) => {
    const { isMobile, isLittleScreen, isMediumScreen } = useBattlegroundBreakpoints();
    const { items } = useSelector(state => state.items);

    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedOption, setSelectedOption] = useState('battlegrounds');

    const handleSelectChange = useCallback(event => {
        setSelectedOption(event.target.value);
        setSelectedItems([]);
    }, []);

    const gridColumns = useMemo(() => {
        if (isMobile) return 2;
        if (isMediumScreen) return 4;
        if (isLittleScreen) return 3;
        return 5;
    }, [isMobile, isLittleScreen, isMediumScreen]);

    return (
        <Modal isVisible onClose={onClose} width={isMobile ? '100%' : '98%'} height={isMobile ? '100%' : '90%'} p={4}>
            <Stack
                direction="column"
                fontFamily="Chelsea Market, System"
                position="absolute"
                top={isMobile ? 2 : 8}
                left={8}>
                <Text fontSize="xs" mx="auto">
                    SEND TO
                </Text>
                <Select
                    w="fit-content"
                    bg="#FFF"
                    color="#000"
                    fontWeight={100}
                    value={selectedOption}
                    onChange={handleSelectChange}>
                    <option value="battlegrounds" style={{ backgroundColor: '#FFF' }}>
                        Army
                    </option>
                    <option value="ardor" style={{ backgroundColor: '#FFF' }}>
                        Inventory
                    </option>
                </Select>
            </Stack>
            <ItemsPage
                infoAccount={infoAccount}
                gridColumns={gridColumns}
                isMobile={isMobile}
                items={items}
                withdraw={selectedOption === 'ardor'}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
            />
        </Modal>
    );
};

export default ItemsInventory;
