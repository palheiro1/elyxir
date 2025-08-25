import { Select, Stack, Text } from '@chakra-ui/react';
import { useState, useMemo, useCallback, memo } from 'react';
import OmnoPage from './OmnoPage';
import ArdorPage from './ArdorPage';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';
import Modal from '../../../../ui/Modal';

/**
 * @name Inventory
 * @description Modal component that displays an inventory interface allowing users to switch between two different
 * views ("Army" and "Inventory") for managing cards. It renders an overlay and a centered modal box with a close
 * button and a selector to toggle between the OmnoPage (Battlegrounds) and ArdorPage views.
 * The layout adapts responsively based on screen size and mobile status, adjusting the grid columns accordingly.
 * @param {Object} props - Component props.
 * @param {Object} props.infoAccount - User account information passed down to child pages.
 * @param {Array} props.cards - Array of user cards passed to child pages.
 * @param {Function} props.handleCloseInventory - Function to close the inventory modal.
 * @returns {JSX.Element} The rendered inventory modal with selectable pages.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company.
 */
const Inventory = ({ infoAccount, cards, handleCloseInventory }) => {
    const [selectedOption, setSelectedOption] = useState('battlegrounds');

    const handleSelectChange = useCallback(event => {
        setSelectedOption(event.target.value);
    }, []);

    const { isMobile, isMediumScreen, isLittleScreen } = useBattlegroundBreakpoints();

    const gridColumns = useMemo(() => {
        if (isMobile) return 2;
        if (isMediumScreen) return 4;
        if (isLittleScreen) return 3;
        return 5;
    }, [isMobile, isLittleScreen, isMediumScreen]);

    const SelectedPage = useMemo(() => {
        return selectedOption === 'battlegrounds' ? (
            <OmnoPage
                infoAccount={infoAccount}
                cards={cards}
                gridColumns={gridColumns}
                isMobile={isMobile}
                handleCloseInventory={handleCloseInventory}
            />
        ) : (
            <ArdorPage
                infoAccount={infoAccount}
                cards={cards}
                gridColumns={gridColumns}
                isMobile={isMobile}
                handleCloseInventory={handleCloseInventory}
            />
        );
    }, [selectedOption, infoAccount, cards, gridColumns, isMobile, handleCloseInventory]);

    return (
        <Modal
            isVisible
            onClose={handleCloseInventory}
            width={isMobile ? '100%' : '98%'}
            height={isMobile ? '100%' : '90%'}
            p={4}>
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

            {SelectedPage}
        </Modal>
    );
};

export default memo(Inventory);
