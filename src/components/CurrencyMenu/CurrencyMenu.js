import {
    Button,
    useDisclosure,
    ButtonGroup,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Portal,
} from '@chakra-ui/react';

import { useRef, useState } from 'react';
import SendCurrencyDialog from '../Modals/SendCurrencyDialog/SendCurrencyDialog';
import { useNavigate } from 'react-router-dom';
import BuyGiftzDialog from '../Modals/BuyGiftzDialog/BuyGiftzDialog';
//import { Link as RouterLink } from 'react-router-dom';

const CurrencyMenu = ({ infoAccount = "", goToMarket }) => {

    const { IGNISBalance, GIFTZBalance, GEMSBalance, name:username } = infoAccount;
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
            goToMarket();
        }
    };

    return (
        <>
            <ButtonGroup
                size="sm"
                fontSize={'sm'}
                isAttached
                variant="outline"
                position="absolute"
                right="4.8%"
                display={{ base: 'none', lg: 'inline-flex' }}>
                <Button>
                    <Menu>
                        <MenuButton>IGNIS: {IGNISBalance}</MenuButton>
                        <Portal>
                            <MenuList>
                                <MenuItem onClick={() => handleOpenSendCurrency('IGNIS')}>Send IGNIS</MenuItem>
                                <MenuItem onClick={() => handleOpenGetMoreCurrency('IGNIS')}>Get IGNIS</MenuItem>
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
                                <MenuItem onClick={() => handleOpenGetMoreCurrency('GIFTZ')}>Get GIFTZ</MenuItem>
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
                                <MenuItem onClick={() => handleOpenGetMoreCurrency('GEMS')}>Get GEM</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                </Button>
            </ButtonGroup>
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
