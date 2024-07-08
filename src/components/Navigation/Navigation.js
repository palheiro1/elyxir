import {
    Box,
    Flex,
    Text,
    IconButton,
    Stack,
    Collapse,
    Icon,
    Link,
    useColorModeValue,
    useDisclosure,
    Image,
    Center,
} from '@chakra-ui/react';

import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';

import { ColorModeSwitcher } from '../ColorModeSwitch/ColorModeSwitcher';
import { NAV_ITEMS } from '../../data/NAV_ITEMS';
import Logo from '../Logo/Logo';
import { Fragment } from 'react';
import '@fontsource/abeezee';
/**
 * This component is used to render the navigation bar
 * @param {boolean} isHeader - By default its true - This parameter is used to render the navigation bar or the footer
 * @param {boolean} isLogged - Indicates if the user is logged in or not
 * @returns {JSX.Element} Navigation component
 * @dev With "isHeader" parameter we can calculate logos and if need ColorSwitcher
 * @author Jesús Sánchez Fernández
 */
const Navigation = ({ isHeader = true, isLogged = false }) => {
    const { isOpen, onToggle } = useDisclosure();

    // -------------------------------------------------------------
    const needTarascaLogo = isHeader ? false : true;
    const needChangeColor = isHeader ? true : false;

    return (
        <Box mt={needTarascaLogo ? 24 : 0} w={'100%'}>
            <Flex
                display={{ md: 'flex' }}
                color={useColorModeValue('gray.600', 'white')}
                minH={{ base: '0px', lg: '60px' }}
                py={{ base: isHeader ? 2 : 0 }}
                pt={{ base: isHeader ? 0 : 8 }}
                borderColor={useColorModeValue('gray.200', 'gray.900')}>
                {isHeader && !isLogged && (
                    <Flex flex={{ base: 1, md: 'auto' }} display={{ base: 'flex', md: 'none' }}>
                        <IconButton
                            onClick={onToggle}
                            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                            variant={'ghost'}
                            aria-label={'Toggle Navigation'}
                        />
                        {needChangeColor && <ColorModeSwitcher position="absolute" right="2.5%" />}
                    </Flex>
                )}

                <Flex flex={1} mx={0}>
                    <Stack display={{ base: 'none', md: 'flex' }} w={'100%'}>
                        <DesktopNav needTarascaLogo={needTarascaLogo} isLogged={isLogged} />
                    </Stack>
                </Flex>

                {needChangeColor && (
                    <ColorModeSwitcher
                        position="absolute"
                        my={'7'}
                        right="2%"
                        color={'#FFF'}
                        display={{ base: 'none', md: 'flex' }}
                    />
                )}
            </Flex>

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
    const linkColor = useColorModeValue('gray.200', 'gray.200');
    const linkHoverColor = useColorModeValue('white', 'white');
    // const laMitad = Math.round(NAV_ITEMS.length / 2);

    return (
        <Stack
            direction={'column'}
            w={'100%'}
            position={needTarascaLogo ? 'absolute' : null}
            bottom={0}
            bgColor={'rgb(98,46,120)'}
            background={'linear-gradient(225deg, rgba(98,46,120,1) 0%, rgba(10,22,49,1) 100%)'}>
            <Stack direction={'row'} spacing={12} align="center" my={'auto'} w={needTarascaLogo ? '95%' : '100%'}>
                <Logo
                    key="logo"
                    width={!needTarascaLogo ? '10%' : null}
                    p={3}
                    mr={!needTarascaLogo ? -5 : null}
                    isLogoGame={!needTarascaLogo}
                    ml={7}
                />
                {NAV_ITEMS.map((navItem, index) => (
                    <Fragment key={index}>
                        <Box key={navItem.label}>
                            <Link
                                p={2}
                                href={navItem.href ?? '#'}
                                fontSize={'sm'}
                                color={linkColor}
                                isExternal
                                fontFamily={'ABeeZee'}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}>
                                {navItem.label}
                            </Link>
                        </Box>
                    </Fragment>
                ))}
                <Box flexGrow={0.7} />
                {!needTarascaLogo && (
                    <Stack py={1} direction={'row'}>
                        <Box w={'400px'} textAlign={'center'} h={'fit-content'} my={'auto'}>
                            <Text
                                fontFamily="'Aagaz', sans-serif"
                                fontSize="4xl"
                                color="#F4931A"
                                letterSpacing="widest"
                                w={'fit-content'}>
                                AT THE GATES OF PROPHECY
                            </Text>
                            <Text fontFamily="'Alatsi', sans-serif" fontSize="sm" color="#F4931A">
                                SEASON 7
                            </Text>
                        </Box>
                        <Image mr={0} src={'/images/logos/new/seasonLogo.svg'} w={'20%'} />
                    </Stack>
                )}
            </Stack>
            {needTarascaLogo && (
                <Stack direction={'column'} w="100%">
                    <Center>
                        <Stack direction={'row'} align="center">
                            <Text textAlign="center" fontSize="small" textColor="#FFF" py={2} w="100%">
                                © 2022 Tarasca GmbH. All Rights Reserved.
                                <br />
                                Build: {process.env.REACT_APP_GIT_SHA}
                            </Text>
                            <Box></Box>
                        </Stack>
                    </Center>
                </Stack>
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
                            <Link key={child.label} py={2} href={child.href} isExternal>
                                {child.label}
                            </Link>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};
