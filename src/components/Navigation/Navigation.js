import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Link,
    useColorModeValue,
    useDisclosure,
    ButtonGroup,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Portal,
} from '@chakra-ui/react';

import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';

import { ColorModeSwitcher } from '../ColorModeSwitch/ColorModeSwitcher';
import { NAV_ITEMS } from '../../data/NAV_ITEMS';
import Logo from '../Logo/Logo';
import { Fragment, useRef, useState } from 'react';
import SendCurrencyDialog from '../Modals/SendCurrencyDialog/SendCurrencyDialog';
//import { Link as RouterLink } from 'react-router-dom';

/**
 * This component is used to render the navigation bar
 * @param {boolean} isHeader - By default its true - This parameter is used to render the navigation bar or the footer
 * @param {boolean} isLogged - Indicates if the user is logged in or not
 * @returns {JSX.Element} Navigation component
 * @dev With "isHeader" parameter we can calculate logos and if need ColorSwitcher
 * @author Jesús Sánchez Fernández
 */
const Navigation = ({ isHeader = true, isLogged = false, IGNISBalance, GIFTZBalance, GEMSBalance }) => {
    const { isOpen, onToggle } = useDisclosure();

    // ----------------------- SEND CURRENCY -----------------------
    const {
        isOpen: isOpenSendCurrency,
        onToggle: onToggleSendCurrency,
        onClose: onCloseSendCurrency,
    } = useDisclosure();
    const reference = useRef();

    const [currency, setCurrency] = useState({ name: 'IGNIS', balance: IGNISBalance });

    const handleOpenSendCurrency = currency => {
        if (currency === 'IGNIS') {
            setCurrency({ name: 'IGNIS', balance: IGNISBalance });
        } else if (currency === 'GIFTZ') {
            setCurrency({ name: 'GIFTZ', balance: GIFTZBalance });
        } else if (currency === 'GEMS') {
            setCurrency({ name: 'GEMS', balance: GEMSBalance });
        }

        onToggleSendCurrency();
    };
    // -------------------------------------------------------------
    const needTarascaLogo = isHeader ? false : true;
    const needChangeColor = isHeader ? true : false;

    return (
        <Box>
            <Flex
                color={useColorModeValue('gray.600', 'white')}
                minH={'60px'}
                py={{ base: isHeader ? 2 : 0 }}
                pt={{ base: isHeader ? 0 : 8 }}
                borderBottom={isHeader ? 1 : 0}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align={'center'}>
                {isHeader && (
                    <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
                        <IconButton
                            onClick={onToggle}
                            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                            variant={'ghost'}
                            aria-label={'Toggle Navigation'}
                        />
                    </Flex>
                )}

                <Flex flex={{ base: 1 }} justify={'center'}>
                    <Flex display={{ base: 'none', md: 'flex' }}>
                        <DesktopNav needTarascaLogo={needTarascaLogo} isLogged={isLogged} />
                    </Flex>
                </Flex>

                {isHeader && isLogged && (
                    <ButtonGroup
                        size="sm"
                        fontSize={'sm'}
                        isAttached
                        variant="outline"
                        position="absolute"
                        right="3%"
                        display={{ base: 'none', lg: 'inline-flex' }}>
                        <Button>
                            <Menu>
                                <MenuButton>IGNIS: {IGNISBalance}</MenuButton>
                                <Portal>
                                    <MenuList>
                                        <MenuItem onClick={() => handleOpenSendCurrency('IGNIS')}>Send IGNIS</MenuItem>
                                        <MenuItem>Get IGNIS</MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                        </Button>
                        <Button>
                            <Menu>
                                <MenuButton>GIFTZ: {GIFTZBalance}</MenuButton>
                                <Portal>
                                    <MenuList>
                                        <MenuItem onClick={() => handleOpenSendCurrency('GIFTZ')}>Send GIFTZ</MenuItem>
                                        <MenuItem>Get GIFTZ</MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                        </Button>
                        <Button>
                            <Menu>
                                <MenuButton>GEM: {GEMSBalance.toFixed(2)}</MenuButton>
                                <Portal>
                                    <MenuList>
                                        <MenuItem onClick={() => handleOpenSendCurrency('GEMS')}>Send GEM</MenuItem>
                                        <MenuItem>Get GEM</MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                        </Button>
                    </ButtonGroup>
                )}

                {needChangeColor && <ColorModeSwitcher ml={-10} justifySelf="flex-end" />}
            </Flex>

            {isOpenSendCurrency && (
                <SendCurrencyDialog
                    isOpen={isOpenSendCurrency}
                    onClose={onCloseSendCurrency}
                    reference={reference}
                    currency={currency}
                />
            )}

            {isHeader && (
                <Collapse in={isOpen} animateOpacity>
                    <MobileNav />
                </Collapse>
            )}
        </Box>
    );
};

export default Navigation;

/**
 * This component is used to render the navigation bar
 * @param {boolean} needTarascaLogo - This parameter is used to render the logo of the game or the logo of the team
 * @returns {JSX.Element} Desktop navigation component
 * @dev With "needTarascaLogo" parameter we can calculate logos
 */
const DesktopNav = ({ needTarascaLogo, isLogged = false }) => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const laMitad = Math.round(NAV_ITEMS.length / 2);

    return (
        <Stack direction={'column'} w="100%" py={2}>
            <Stack direction={'row'} spacing={24} align="center">
                {NAV_ITEMS.map((navItem, index) => (
                    <Fragment key={index}>
                        {laMitad === index && <Logo key="logo" isLogoGame={!needTarascaLogo} />}
                        <Box key={navItem.label}>
                            <Link
                                p={2}
                                href={navItem.href ?? '#'}
                                fontSize={'sm'}
                                fontWeight={'bold'}
                                color={linkColor}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}>
                                {navItem.label}
                            </Link>
                        </Box>
                    </Fragment>
                ))}
                {/*
                (!isLogged && !needTarascaLogo) && (
					<Button
						as={RouterLink}
						display={{ base: 'none', md: 'inline-flex' }}
						fontSize={'sm'}
						fontWeight={'bold'}
						border={'2px'}
						borderColor={'orange.400'}
						to="/login"
						px={8}
						variant="outline"
						key="login"
						_hover={{
							bg: 'orange.400',
						}}>
						Login
					</Button>
                    )*/}
            </Stack>
            {needTarascaLogo && (
                <Text textAlign="center" fontSize="small" textColor="gray.600" pb={2} w="100%">
                    © 2022 Tarasca GmbH. All Rights Reserved.
                </Text>
            )}
        </Stack>
    );
};

/**
 * This component is used to render the navigation bar for Mobile
 * @returns {JSX.Element} Mobile navigation component
 */
const MobileNav = () => {
    return (
        <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
            {NAV_ITEMS.map(navItem => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
        </Stack>
    );
};

/**
 * This component is used to render the navigation bar for Mobile (for items)
 * @param {string} label - This parameter is used to render the label of the item
 * @param {string} children - This parameter is used to render the children of the item
 * @param {string} href - This parameter is used to render the href of the item
 * @returns {JSX.Element} Mobile navigation item component
 */
const MobileNavItem = ({ label, children, href }) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Flex
                py={2}
                as={Link}
                href={href ?? '#'}
                justify={'space-between'}
                align={'center'}
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Flex>

            <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align={'start'}>
                    {children &&
                        children.map(child => (
                            <Link key={child.label} py={2} href={child.href}>
                                {child.label}
                            </Link>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};
