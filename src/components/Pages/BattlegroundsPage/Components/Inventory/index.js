import { Box, IconButton, Select, Stack, Text, useMediaQuery } from '@chakra-ui/react';
import { useState, useMemo, useCallback, memo } from 'react';
import { Overlay } from '../../../../ui/Overlay';
import { CloseIcon } from '@chakra-ui/icons';
import OmnoPage from './OmnoPage';
import ArdorPage from './ArdorPage';

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
 * @param {boolean} props.isMobile - Flag indicating if the device is mobile, to adjust layout responsively.
 * @returns {JSX.Element} The rendered inventory modal with selectable pages.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company.
 */
const Inventory = ({ infoAccount, cards, handleCloseInventory, isMobile }) => {
    const [selectedOption, setSelectedOption] = useState('battlegrounds');

    const handleSelectChange = useCallback(event => {
        setSelectedOption(event.target.value);
    }, []);

    const [isLittleScreen] = useMediaQuery('(min-width: 1180px) and (max-width: 1399px)');
    const [isMediumScreen] = useMediaQuery('(min-width: 1400px) and (max-width: 1550px)');

    const gridColumns = useMemo(() => {
        if (isMobile) return 1;
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
        <>
            <Overlay isVisible handleClose={handleCloseInventory} />
            <Box
                pos="fixed"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bgColor="#1F2323"
                zIndex={99}
                w={isMobile ? '90%' : '98%'}
                p={4}
                display="flex"
                flexDir="column"
                h={isMobile ? '85%' : '90%'}
                borderRadius="25px">
                <IconButton
                    background="transparent"
                    color="#FFF"
                    icon={<CloseIcon />}
                    _hover={{ background: 'transparent' }}
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={handleCloseInventory}
                    aria-label="Close inventory"
                />
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
            </Box>
        </>
    );
};

export default memo(Inventory);
