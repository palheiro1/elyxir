import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Box, Collapse, Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import MobileMenu from './MobileMenu';

import NormalMenu from './NormalMenu';

/**
 * @name LateralMenu
 * @description Component that shows the lateral menu of the app
 * @param {Number} option - Option selected
 * @param {Function} setOption - Function to set the option
 * @param {JSX.Element} children - Components to show in the main section
 * @param {Boolean} showAllCards - Boolean to show all cards
 * @param {Function} handleShowAllCards - Function to handle the show all cards
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const LateralMenu = ({
    option = 0,
    setOption,
    children,
    showAllCards,
    handleShowAllCards,
    username,
    account,
    handleLogout,
}) => {
    const { isOpen, onToggle, onClose } = useDisclosure();

    if (!username || !account) return null;

    const handleSetOption = (option) => {
        setOption(option);
        onClose();
    }

    return (
        <Box>
            <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
                <IconButton
                    onClick={onToggle}
                    icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                    variant={'ghost'}
                    aria-label={'Toggle Navigation'}
                />
            </Flex>
            <Flex display={{ base: 'none', md: 'unset' }}>
                <NormalMenu
                    option={option}
                    setOption={setOption}
                    handleLogout={handleLogout}
                    username={username}
                    account={account}
                    showAllCards={showAllCards}
                    handleShowAllCards={handleShowAllCards}
                    children={children}
                />
            </Flex>
            <Collapse in={isOpen} animateOpacity>
                <MobileMenu
                    option={option}
                    setOption={handleSetOption}
                    handleLogout={handleLogout}
                    username={username}
                    account={account}
                    showAllCards={showAllCards}
                    handleShowAllCards={handleShowAllCards}
                />
            </Collapse>
            <Flex display={{ base: 'block', md: 'none' }}>{!isOpen ? children : null}</Flex>
        </Box>
    );
};

export default LateralMenu;
