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
} from '@chakra-ui/react';

import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
} from '@chakra-ui/icons';

import { ColorModeSwitcher } from '../ColorModeSwitch/ColorModeSwitcher';
import { NAV_ITEMS } from '../../data/NAV_ITEMS';
import Logo from '../Logo/Logo';

const Navigation = ({ isHeader = true }) => {
    const { isOpen, onToggle } = useDisclosure();
    const needTarascaLogo = isHeader ? false : true;
    const needChangeColor = isHeader ? true : false;

    return (
        <Box mb={8}>
            <Flex
            color={useColorModeValue('gray.600', 'white')}
            minH={'60px'}
            py={{ base: isHeader ? 2 : 0 }}
            px={{ base: 4 }}
            pt={{ base: isHeader ? 0 : 8 }}
            borderBottom={isHeader ? 1 : 0}
            borderStyle={'solid'}
            borderColor={useColorModeValue('gray.200', 'gray.900')}
            align={'center'}>
                <Flex
                flex={{ base: 1, md: 'auto' }}
                ml={{ base: -2 }}
                display={{ base: 'flex', md: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={
                        isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                        }
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>
                <Flex flex={{ base: 1 }} justify={'center'}>
                    <Flex display={{ base: 'none', md: 'flex' }}>
                        <DesktopNav needTarascaLogo = {needTarascaLogo} />
                    </Flex>
                </Flex>

                { needChangeColor && <ColorModeSwitcher justifySelf="flex-end" /> }
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav />
            </Collapse>
        </Box>
    );
}

export default Navigation;
  
const DesktopNav = ({ needTarascaLogo }) => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const laMitad = Math.round((NAV_ITEMS.length)/2);

    return (
        <Stack direction={'row'} spacing={16} align="center">
            {NAV_ITEMS.map((navItem, index) => (
                <>
                { laMitad === index && <Logo key="logo" isLogoGame = {!needTarascaLogo} /> }
                <Box key={navItem.label}>
                    <Link
                        p={2}
                        href={navItem.href ?? '#'}
                        fontSize={'sm'}
                        fontWeight={"bold"}
                        color={linkColor}
                        _hover={{
                        textDecoration: 'none',
                        color: linkHoverColor,
                        }}>
                        {navItem.label}
                    </Link>
                </Box>
                </>
            ))}
            <Button
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={"bold"}
            border = {'2px'}
            borderColor={'orange.400'}
            href={'#'}
            px={8}
            variant="outline"
            key="login"
            _hover={{
                bg: 'orange.400',
            }}>
                Login
            </Button>
        </Stack>
    );
};
  
const MobileNav = () => {
    return (
        <Stack
        bg={useColorModeValue('white', 'gray.800')}
        p={4}
        display={{ md: 'none' }}>
            {NAV_ITEMS.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
        </Stack>
    );
};
  
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
                <Text
                fontWeight={600}
                color={useColorModeValue('gray.600', 'gray.200')}>
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
                    children.map((child) => (
                    <Link key={child.label} py={2} href={child.href}>
                        {child.label}
                    </Link>
                    ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};