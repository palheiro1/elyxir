import { Stack, Box, Text, Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { ChevronUpIcon } from '@chakra-ui/icons';
import { Fragment } from 'react';
import ListButton from './ListButton';
import { buttonsGroups } from '../data';
import { useNavigate } from 'react-router-dom';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';

/**
 * @name BattlegroundMenu
 * @description Responsive menu component that displays grouped buttons for interacting with the Battlegrounds section.
 * On desktop, it renders stacked buttons with titles; on mobile, a dropdown menu is shown.
 * @param {Object} props - Props object.
 * @param {Function} props.setOpenModal - Callback used to open a modal by name.
 * @returns {JSX.Element} A responsive menu with grouped action buttons for opening modals or triggering actions.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattlegroundMenu = ({ setOpenModal }) => {
    const navigate = useNavigate();
    const { isMobile } = useBattlegroundBreakpoints();
    const handleClick = (modal, action) => {
        if (modal) {
            setOpenModal(modal);
        } else if (action) {
            action(navigate);
        }
    };

    return !isMobile ? (
        <Stack direction="column" mx="auto">
            {buttonsGroups.map(({ title, buttons, color }, groupIdx) => (
                <Box key={groupIdx} mt={2} textAlign="center">
                    {title && (
                        <Text fontFamily="'Chelsea Market', system-ui" textTransform="uppercase" fontSize="xs">
                            {title}
                        </Text>
                    )}

                    {buttons.map(({ name, disabled, tooltip, modal, action }, btnIdx) => (
                        <ListButton
                            key={`${groupIdx}-${btnIdx}`}
                            disabled={disabled}
                            tooltip={tooltip}
                            color={color}
                            onclick={() => handleClick(modal, action)}>
                            {name}
                        </ListButton>
                    ))}
                </Box>
            ))}
        </Stack>
    ) : (
        <Menu placement="top">
            <MenuButton
                as={Button}
                bgColor="transparent"
                rightIcon={<ChevronUpIcon />}
                fontFamily="'Chelsea Market', system-ui"
                color="#FFF">
                Menu
            </MenuButton>
            <MenuList bg="#202323" border="none">
                {buttonsGroups.map(({ buttons }, groupIdx) => (
                    <Fragment key={groupIdx}>
                        {buttons.map(({ name, modal, action }, btnIdx) => (
                            <MenuItem
                                key={`${groupIdx}-${btnIdx}`}
                                bg="#202323"
                                color="#FFF"
                                onClick={() => handleClick(modal, action)}
                                fontFamily="'Chelsea Market', system-ui">
                                {name}
                            </MenuItem>
                        ))}
                    </Fragment>
                ))}
            </MenuList>
        </Menu>
    );
};

export default BattlegroundMenu;
