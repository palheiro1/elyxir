import {
    Box,
    Button,
    Image,
    Img,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Portal,
    Stack,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useColorModeValue,
    useDisclosure,
    Center,
    HStack,
    PinInput,
    PinInputField,
    Input,
    useToast,
    FormControl,
    FormLabel,
} from '@chakra-ui/react';
import { Maps } from './Maps';
import React, { useEffect, useState } from 'react';
import { ScrollLock } from './Components/ScrollLock';
import { BattlegroundsIntro } from './Components/BattlegroundsIntro/BattlegroundsIntro';
import logo from './assets/image.png';
import './BattlegroundMap.css';
import { AdvertModal } from './Components/AdvertModal';
import { BattleWindow } from './Components/BattleWindow/BattleWindow';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import Inventory from './Components/Inventory/Inventory';
import { addressToAccountId } from '../../../services/Ardor/ardorInterface';
import { getUsersState } from '../../../services/Ardor/omnoInterface';
import { GEMASSET, NQTDIVIDER, WETHASSET } from '../../../data/CONSTANTS';
import { checkPin, sendGEMSToOmno } from '../../../utils/walletUtils';
import { errorToast } from '../../../utils/alerts';

const Battlegrounds = ({ infoAccount, cards }) => {
    /* Intro pop up managing */
    const {
        IGNISBalance,
        GIFTZBalance,
        GEMBalance,
        WETHBalance,
        MANABalance,
        name: username,
        accountRs,
        publicKey,
    } = infoAccount;

    const [visible, setVisible] = useState(true);
    const [page, setPage] = useState(1);
    const [isScrollLocked, setIsScrollLocked] = useState(true);

    const [selectedArena, setSelectedArena] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openBattle, setOpenBattle] = useState(false);
    const [openInventory, setOpenInventory] = useState(false);

    const toast = useToast();

    const handleNext = () => {
        setPage(2);
    };

    const handleClose = () => {
        setVisible(false);
        setIsScrollLocked(false);
    };

    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
    const bgColor = useColorModeValue('rgba(234, 234, 234, 0.5)', 'rgba(234, 234, 234, 1)');

    /* Buttons menu list */
    const buttons = [
        {
            name: 'Inventory',
            onclick: () => {
                setOpenInventory(true);
                setIsScrollLocked(true);
            },
        },
        { name: 'Scoreboard' },
        { name: 'Elixir' },
        { name: 'Earnings' },
        { name: 'Battle record' },
        { name: 'FAQ' },
    ];

    const statistics = [
        { name: 'Active player', value: 3 },
        { name: 'Battles disputed', value: 24 },
        { name: 'GEM Rewards', value: '245k' },
        { name: 'General ranking', value: 7 },
        { name: 'Time remaining', value: '14 weeks' },
    ];

    const handleStartBattle = () => {
        if (selectedArena) {
            console.log('SELECTED', selectedArena);
            setOpenBattle(true);
            setIsScrollLocked(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleSelectArena = arena => {
        setSelectedArena(arena);
    };

    const handleCloseInventory = () => {
        setOpenInventory(false);
        setIsScrollLocked(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsScrollLocked(false);
    };

    const handleCloseBattle = () => {
        setOpenBattle(false);
        setIsScrollLocked(false);
    };

    let wEthDecimals = 0;

    // const [userInfo, setUserInfo] = useState();
    const [filteredCards, setFilteredCards] = useState([]);
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [omnoUserInfo, setOmnoUserInfo] = useState();
    const [passphrase, setPassphrase] = useState('');
    const [omnoGEMsBalance, setOmnoGEMsBalance] = useState(null);
    const [OmnoWethBalance, setOmnoWethBalance] = useState(null);

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const { name } = infoAccount;
        const account = checkPin(name, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const parseWETH = parseFloat(OmnoWethBalance);

    useEffect(() => {
        const filterCards = async () => {
            const userInfo = await getUserState();
            setOmnoUserInfo(userInfo);
            if (userInfo.balance) {
                const assetIds = Object.keys(userInfo.balance.asset);
                setOmnoGEMsBalance(userInfo.balance.asset[GEMASSET] || 0);
                setOmnoWethBalance(userInfo.balance.asset[WETHASSET] || 0);

                const matchingCards = cards.filter(card => assetIds.includes(card.asset));
                // console.log(matchingCards);
                setFilteredCards(matchingCards);
            }
        };
        filterCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cards, infoAccount]);

    const getUserState = async () => {
        const accountId = addressToAccountId(accountRs);
        console.log('🚀 ~ getUserState ~ accountId:', accountId);
        let res = await getUsersState().then(res => {
            return res.data.find(item => item.id === accountId);
        });
        return res;
    };
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [amount, setAmount] = useState(0);
    const maxAmount = 1400;

    const increment = () => {
        if (amount < maxAmount) {
            setAmount(amount + 1);
        }
    };

    const decrement = () => {
        if (amount > 0) {
            setAmount(amount - 1);
        }
    };

    const handleChange = event => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value >= 0 && value <= maxAmount) {
            setAmount(value);
        }
    };

    const handleSendSGEMS = async () => {
        if (!isValidPin) {
            return errorToast('The pin is invalid', toast);
        }
        console.log('🚀 ~ handleSendSGEMS ~ amount:', amount);

        await sendGEMSToOmno({ quantity: amount, passPhrase: passphrase });
    };

    return (
        <>
            <Box className="landscape-only">
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Send GEM</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody display={'flex'}>
                            <Stack direction={'column'} mx={'auto'}>
                                <Center>
                                    <FormControl variant="floatingModalTransparent" id="Amount" my={4}>
                                        <HStack spacing={0} border="1px" rounded="lg" borderColor={'gray.300'}>
                                            <Button
                                                onClick={decrement}
                                                rounded="none"
                                                borderLeftRadius="lg"
                                                size="lg"
                                                color="white"
                                                bgColor={'#F48794'}>
                                                -
                                            </Button>
                                            <Input
                                                value={amount}
                                                onChange={handleChange}
                                                rounded="none"
                                                border="none"
                                                color="black"
                                                textAlign="center"
                                                fontWeight="bold"
                                                size="lg"
                                                type="number"
                                                min="0"
                                                max={maxAmount}
                                            />
                                            <Button
                                                onClick={increment}
                                                rounded="none"
                                                borderRightRadius="lg"
                                                color="white"
                                                size="lg"
                                                bgColor={'#F48794'}>
                                                +
                                            </Button>
                                        </HStack>
                                        <FormLabel>
                                            {' '}
                                            <Text color={'#000'}>Amount to send (max: 1400)</Text>
                                        </FormLabel>
                                    </FormControl>
                                </Center>
                                <Stack direction={'row'} spacing={7}>
                                    <PinInput
                                        size="lg"
                                        onComplete={handleCompletePin}
                                        onChange={handleCompletePin}
                                        isInvalid={!isValidPin}
                                        variant="filled"
                                        mask>
                                        <PinInputField />
                                        <PinInputField />
                                        <PinInputField />
                                        <PinInputField />
                                    </PinInput>
                                </Stack>
                            </Stack>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={handleSendSGEMS}>
                                Submit
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                {openBattle && (
                    <BattleWindow
                        arenaInfo={selectedArena}
                        handleCloseBattle={handleCloseBattle}
                        infoAccount={infoAccount}
                        cards={cards}
                        filteredCards={filteredCards}
                    />
                )}
                {openInventory && (
                    <Inventory
                        infoAccount={infoAccount}
                        cards={cards}
                        handleCloseInventory={handleCloseInventory}
                        filteredCards={filteredCards}
                    />
                )}
                <BattlegroundsIntro visible={visible} page={page} handleClose={handleClose} handleNext={handleNext} />
                <AdvertModal isOpen={isModalOpen} onClose={closeModal} />
                <ScrollLock isLocked={isScrollLocked} />
                <Box position={'relative'} ml={6} mt={5}>
                    <Img src={logo} color={'#FFF'} />
                    <Stack direction={'row'} gap={4}>
                        <Stack direction={'column'} gap={4} ml={'80px'} mt={'10px'}>
                            <Text color={'black'} fontFamily={'Chelsea Market, system-ui'}>
                                CURRENCIES
                            </Text>
                            <Menu>
                                <MenuButton
                                    color={'black'}
                                    bgColor={bgColor}
                                    borderColor={borderColor}
                                    rounded="lg"
                                    w="5rem"
                                    maxH={'2.2rem'}
                                    // _hover={{ bg: hoverColor }}
                                >
                                    <Stack direction="row" align="center">
                                        <Image
                                            ml={-5}
                                            src="images/currency/gem.png"
                                            alt="GEM Icon"
                                            w="50 px"
                                            h="50px"
                                        />
                                        <Text>{omnoGEMsBalance / NQTDIVIDER}</Text>
                                    </Stack>
                                </MenuButton>
                                <Portal>
                                    <MenuList>
                                        <MenuItem onClick={onOpen}>Add GEM to Game</MenuItem>
                                        <MenuItem>Send GEM to Wallet</MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                            <Menu>
                                <MenuButton
                                    color={'black'}
                                    bgColor={bgColor}
                                    borderColor={borderColor}
                                    rounded="lg"
                                    w="5rem"
                                    maxH={'2.2rem'}
                                    // _hover={{ bg: hoverColor }}
                                >
                                    <Stack direction="row" align="center">
                                        <Image
                                            ml={-5}
                                            src="images/currency/weth.png"
                                            alt="wETH Icon"
                                            w="50px"
                                            h="50px"
                                        />
                                        <Text>
                                            {parseWETH.toFixed(Math.max(0, wEthDecimals <= 6 ? wEthDecimals : 6))}
                                        </Text>
                                    </Stack>
                                </MenuButton>

                                <Portal>
                                    <MenuList>
                                        <MenuItem>Add WETH to Game</MenuItem>
                                        <MenuItem>Send WETH to Wallet</MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                        </Stack>
                        <Box mt={8} padding={'30px'} pos={'absolute'} top={'12rem'}>
                            {buttons.map(btn => (
                                <Box className="btn-menu" m={5} key={btn.i} onClick={btn.onclick}>
                                    {btn.name}
                                </Box>
                            ))}
                        </Box>
                        <Box ml={'80px'}>
                            <Maps handleSelectArena={handleSelectArena} infoAccount={infoAccount} cards={cards} />
                        </Box>
                    </Stack>
                    <Stack direction={'row'} mt={6}>
                        <Stack
                            direction={'row'}
                            backgroundColor={'#484848'}
                            border={'2px solid #D597B2'}
                            ml={'100px'}
                            borderRadius={'30px'}
                            w={'1000px'}
                            fontFamily={'Chelsea Market, system-ui'}>
                            {statistics.map(item => (
                                <Stack direction={'row'} m={3} key={item.i}>
                                    <Text color={'#FFF'}>{item.name}:</Text>
                                    <Text color={'#D597B2'}>{item.value}</Text>
                                </Stack>
                            ))}
                        </Stack>
                        <Button
                            style={{
                                background: 'linear-gradient(224.72deg, #5A679B 12.32%, #5A679B 87.76%)',
                                border: '3px solid #EBB2B9',
                            }}
                            padding={5}
                            textTransform={'uppercase'}
                            color={'#FFF'}
                            fontWeight={'100'}
                            borderRadius={'40px'}
                            zIndex={5}
                            fontFamily={'Chelsea Market, system-ui'}
                            onClick={handleStartBattle}>
                            Start battle
                        </Button>
                    </Stack>
                </Box>
            </Box>
            <Box className="rotate-device" zIndex={999}>
                <Text>Please rotate your device to landscape mode to view this content.</Text>
            </Box>
        </>
    );
};

export default Battlegrounds;
