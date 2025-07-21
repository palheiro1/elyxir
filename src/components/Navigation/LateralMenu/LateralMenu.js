import { memo } from 'react';
import { Box, Collapse, Flex, IconButton, Spacer, useDisclosure } from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { ColorModeSwitcher } from '../../ColorModeSwitch/ColorModeSwitcher';

// Menu types
import NormalMenu from './NormalMenu';
import MobileMenu from './MobileMenu';
import TopMenu from '../../../pages/Home/TopMenu';

/**
 * @name LateralMenu
 * @description Component that shows the lateral menu of the app & children components
 * @param {Number} option - Option selected
 * @param {Function} setOption - Function to set the option
 * @param {JSX.Element} children - Components to show in the main section
 * @param {Boolean} showAllCards - Boolean to show all cards
 * @param {Function} handleShowAllCards - Function to handle the show all cards
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const LateralMenu = memo(
    ({
        option = 0,
        setOption,
        children,
        showAllCards,
        handleShowAllCards,
        infoAccount,
        handleLogout,
        goToSection,
        cardsLoaded,
        setSelectedBridgeType,
    }) => {
        const { isOpen, onToggle, onClose } = useDisclosure();

        const handleSetOption = option => {
            setOption(option);
            onClose();
        };

        return (
            <Box>
                <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                    <Spacer />
                    <ColorModeSwitcher justifySelf="flex-end" />
                </Flex>
                <Flex display={{ base: 'none', md: 'unset' }}>
                    <TopMenu
                        infoAccount={infoAccount}
                        goToSection={goToSection}
                        setSelectedBridgeType={setSelectedBridgeType}
                    />
                </Flex>
                <Flex display={{ base: 'none', md: 'unset' }}>
                    <NormalMenu
                        option={option}
                        setOption={setOption}
                        handleLogout={handleLogout}
                        showAllCards={showAllCards}
                        handleShowAllCards={handleShowAllCards}
                        children={children}
                        cardsLoaded={cardsLoaded}
                        setSelectedBridgeType={setSelectedBridgeType}
                    />
                </Flex>
                <Collapse in={isOpen} animateOpacity>
                    {infoAccount && (
                        <MobileMenu
                            option={option}
                            setOption={handleSetOption}
                            handleLogout={handleLogout}
                            infoAccount={infoAccount}
                            showAllCards={showAllCards}
                            handleShowAllCards={handleShowAllCards}
                            goToSection={goToSection}
                            cardsLoaded={cardsLoaded}
                            setSelectedBridgeType={setSelectedBridgeType}
                        />
                    )}
                </Collapse>
                <Flex display={{ base: 'block', md: 'none' }}>{!isOpen ? children : null}</Flex>
            </Box>
        );
    }
);

export default LateralMenu;
