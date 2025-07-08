import { GoTriangleDown } from 'react-icons/go';
import { Box, Button, Image, Menu, MenuButton, MenuItem, MenuList, Text, useBreakpointValue } from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';

/**
 * @name ProfileDropdown
 * @description Dropdown menu for the user's profile, with options for Messages, Account, and Logout.
 * Handles both mobile and desktop layouts responsively.
 * @param {Function} setOption - Callback to change the active option in the UI (e.g., navigate to a section).
 * @param {Function} handleLogout - Callback to execute logout logic.
 * @returns {JSX.Element} A Chakra UI dropdown menu component for user interactions.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const ProfileDropdown = ({ setOption, handleLogout }) => {
    const menuItemProps = {
        bgColor: '#585858',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: 'sm',
    };

    const isMobile = useBreakpointValue({ base: true, md: false });
    return (
        <Box position={'absolute'} right={{ base: 14, md: 2, lg: 12 }} top={isMobile && '25px'}>
            <Menu maxW={'100px'}>
                {isMobile ? (
                    <MenuButton as={Button} bgColor={'transparent'}>
                        <FaUser />
                    </MenuButton>
                ) : (
                    <MenuButton
                        as={Button}
                        rightIcon={<GoTriangleDown />}
                        leftIcon={<FaUser />}
                        bgColor={'#E14942'}
                        fontFamily={'Inter'}
                        fontWeight={'regular'}
                        _hover={{ bgColor: 'rgba(225, 73, 66, 0.75)' }}
                        _active={{ bgColor: 'rgba(225, 73, 66, 0.85)' }}>
                        Profile
                    </MenuButton>
                )}

                <MenuList bgColor="#1F2323" borderRadius="10px" p={2} w="140px" minW="unset">
                    <MenuItem onClick={() => setOption(9)} {...menuItemProps}>
                        <Image src="/images/icons/menu/blanco/messages.png" boxSize={'15px'} />
                        <Text left={0} fontWeight={'semibold'}>
                            Messages
                        </Text>
                    </MenuItem>
                    <MenuItem onClick={() => setOption(6)} {...menuItemProps} mt={2}>
                        <Image src="/images/icons/menu/blanco/account.png" boxSize={'15px'} />
                        <Text fontWeight={'semibold'}>Account</Text>
                    </MenuItem>
                    <MenuItem onClick={handleLogout} {...menuItemProps} mt={2}>
                        <Image src="/images/icons/menu/blanco/logout.png" boxSize={'15px'} />
                        <Text fontWeight={'semibold'}>Logout</Text>
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
    );
};

export default ProfileDropdown;
