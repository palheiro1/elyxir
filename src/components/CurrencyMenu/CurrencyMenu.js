import {
    useDisclosure,
    ButtonGroup,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Portal,
    Flex,
    Box,
    useColorModeValue,
} from '@chakra-ui/react';

import { useRef, useState } from 'react';
import SendCurrencyDialog from '../Modals/SendCurrencyDialog/SendCurrencyDialog';
import { useNavigate } from 'react-router-dom';
import BuyGiftzDialog from '../Modals/BuyGiftzDialog/BuyGiftzDialog';

const CurrencyMenu = ({ infoAccount = '', goToSection }) => {
    const { IGNISBalance, GIFTZBalance, GEMSBalance, name: username } = infoAccount;

    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    const navigate = useNavigate();

    const { isOpen: isOpenBuyGiftz, onClose: onCloseBuyGiftz, onOpen: onOpenBuyGiftz } = useDisclosure();
    const referenceBuyGiftz = useRef();
    // ----------------------- SEND CURRENCY -----------------------
    const { isOpen: isOpenSendCurrency, onClose: onCloseSendCurrency, onOpen: onOpenSendCurrency } = useDisclosure();
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

        onOpenSendCurrency();
    };

    const handleOpenGetMoreCurrency = currency => {
        if (currency === 'IGNIS') {
            navigate('/exchange');
        } else if (currency === 'GIFTZ') {
            onOpenBuyGiftz();
        } else if (currency === 'GEMS') {
            goToSection(3);
        }
    };

    if (!IGNISBalance || !GIFTZBalance || !GEMSBalance || !username) return null;

    return (
        <>
            <Flex align="flex-end">
                <ButtonGroup rounded="lg" shadow="md" size="sm" fontSize={'sm'} isAttached variant="outline">
                    <Box p={1} border="1px" borderColor={borderColor} borderLeftRadius="lg" px={2}>
                        <Menu>
                            <MenuButton>IGNIS: {IGNISBalance}</MenuButton>
                            <Portal>
                                <MenuList>
                                    <MenuItem onClick={() => handleOpenSendCurrency('IGNIS')}>Send IGNIS</MenuItem>
                                    <MenuItem onClick={() => handleOpenGetMoreCurrency('IGNIS')}>Get IGNIS</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                    <Box p={1} border="1px" borderColor={borderColor} px={2}>
                        <Menu>
                            <MenuButton>GIFTZ: {GIFTZBalance}</MenuButton>
                            <Portal>
                                <MenuList>
                                    <MenuItem onClick={() => handleOpenSendCurrency('GIFTZ')}>Send GIFTZ</MenuItem>
                                    <MenuItem onClick={() => handleOpenGetMoreCurrency('GIFTZ')}>Get GIFTZ</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                    <Box p={1} border="1px" borderColor={borderColor} borderRightRadius="lg" px={2}>
                        <Menu>
                            <MenuButton>GEM: {GEMSBalance.toFixed(2)}</MenuButton>
                            <Portal>
                                <MenuList>
                                    <MenuItem onClick={() => handleOpenSendCurrency('GEMS')}>Send GEM</MenuItem>
                                    <MenuItem onClick={() => handleOpenGetMoreCurrency('GEMS')}>Get GEM</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </ButtonGroup>
            </Flex>
            {isOpenSendCurrency && (
                <SendCurrencyDialog
                    isOpen={isOpenSendCurrency}
                    onClose={onCloseSendCurrency}
                    reference={reference}
                    currency={currency}
                    IGNISBalance={IGNISBalance}
                    username={username}
                />
            )}

            <BuyGiftzDialog
                isOpen={isOpenBuyGiftz}
                onClose={onCloseBuyGiftz}
                reference={referenceBuyGiftz}
                name={username}
                IGNISBalance={IGNISBalance}
            />
        </>
    );
};

export default CurrencyMenu;
