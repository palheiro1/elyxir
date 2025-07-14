import { useEffect, useState } from 'react';
import {
    Button,
    Stack,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Center,
    HStack,
    PinInput,
    PinInputField,
    Input,
    FormControl,
    FormLabel,
    useToast,
} from '@chakra-ui/react';
import { checkPin, sendWETHToOmno, withdrawWETHFromOmno } from '../../../../../utils/walletUtils';
import { errorToast, okToast } from '../../../../../utils/alerts';
import { addressToAccountId } from '../../../../../services/Ardor/ardorInterface';
import { getUsersState } from '../../../../../services/Ardor/omnoInterface';
import { NQTDIVIDER, WETHASSET } from '../../../../../data/CONSTANTS';
import { WethMode } from '../../data';

/**
 * @name SendWethToOmno
 * @description Modal component that allows users to send or withdraw WETH tokens to/from Omno.
 * Depending on the mode (`wethModalMode`), users can input an amount, verify their action via a 4-digit PIN,
 * and submit the transaction. The component fetches and displays the user's balance either from their account
 * or from Omno, validates input amounts, and provides success/error toast notifications.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls whether the modal is visible.
 * @param {() => void} props.onClose - Function to close the modal.
 * @param {Object} props.infoAccount - User's account info.
 * @param {number} props.infoAccount.WETHBalance - User's current WETH balance.
 * @param {string} props.infoAccount.accountRs - User's Ardor account RS address.
 * @param {boolean} props.wethModalMode - Mode flag: if true, modal is for sending WETH; if false, for withdrawing WETH.
 * @returns {JSX.Element} A Chakra UI modal with amount input, increment/decrement buttons, PIN input, and submit button.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const SendWethToOmno = ({ isOpen, onClose, infoAccount, wethModalMode }) => {
    const { WETHBalance, accountRs } = infoAccount;

    const wethMode = WethMode[wethModalMode];
    const toast = useToast();

    const [amount, setAmount] = useState(0);
    const [passphrase, setPassphrase] = useState('');
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [omnoWETHBalance, setOmnoWETHBalance] = useState(0);

    useEffect(() => {
        const getOmnoWETHBalance = async () => {
            const userInfo = await getUserState();
            if (userInfo?.balance) {
                setOmnoWETHBalance(userInfo.balance?.asset[WETHASSET] / NQTDIVIDER || 0);
            }
        };
        getOmnoWETHBalance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [infoAccount]);

    const getUserState = async () => {
        const accountId = addressToAccountId(accountRs);
        let res = await getUsersState().then(res => {
            return res.data.find(item => item.id === accountId);
        });
        return res;
    };

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const { name } = infoAccount;
        const account = checkPin(name, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const incrementWeth = () => {
        if (amount < maxAmount) {
            setAmount(amount + 0.0001);
        }
    };

    const decrementWeth = () => {
        if (amount > 0) {
            setAmount(amount - 0.0001);
        }
    };

    const handleChange = event => {
        const value = event.target.value;
        if (!isNaN(value) && value >= 0 && value <= maxAmount) {
            setAmount(value);
        }
    };

    const handleSendWeth = async () => {
        if (!isValidPin) {
            return errorToast('The pin is invalid', toast);
        }

        if (amount <= 0) {
            return errorToast(`The quantity to send must be greater than 0`, toast);
        }

        let res = await sendWETHToOmno({ quantity: amount, passPhrase: passphrase });
        if (!res) {
            return errorToast("You don't have enough IGNIS to transact");
        }
        setAmount(0);
        onClose();
        return okToast('WETH have been sent correctly', toast);
    };

    const handleWithdrawWeth = async () => {
        if (!isValidPin) {
            return errorToast('The pin is invalid', toast);
        }

        if (amount <= 0) {
            return errorToast('The quantity to withdraw must be greater than 0', toast);
        }

        let res = await withdrawWETHFromOmno({ quantity: amount, passPhrase: passphrase });
        if (!res) {
            return errorToast("You don't have enough IGNIS to transact");
        }
        setAmount(0);
        onClose();
        return okToast('WETH have been withdrawn correctly', toast);
    };

    const handleClose = () => {
        setAmount(0);
        onClose();
    };

    const maxAmount = wethMode ? WETHBalance : omnoWETHBalance;

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay onClose={handleClose} />
            <ModalContent bgColor={'#ebb2b9'} border={'2px solid #F48794'}>
                <ModalHeader mx={'auto'} color={'#000'}>
                    {wethMode ? 'SEND' : 'WITHDRAW'} WETH
                </ModalHeader>
                <ModalCloseButton onClick={handleClose} />
                <ModalBody display={'flex'}>
                    <Stack direction={'column'} mx={'auto'}>
                        <Center>
                            <FormControl variant="floatingModalTransparent" id="Amount" my={4}>
                                <HStack spacing={0} border="1px" rounded="lg" borderColor={'#F48794'}>
                                    <Button
                                        onClick={decrementWeth}
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
                                        color="#FFF"
                                        textAlign="center"
                                        fontWeight="bold"
                                        size="lg"
                                        type="number"
                                        min="0"
                                        max={maxAmount}
                                    />
                                    <Button
                                        onClick={incrementWeth}
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
                                    <Text color={'#FFF'}>Amount to send (max: {maxAmount})</Text>
                                </FormLabel>
                            </FormControl>
                        </Center>
                        <Stack direction={'row'} spacing={7} mx={'auto'}>
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
                    <Button
                        color={'#fff'}
                        bgColor="#F48794"
                        mr={3}
                        mx={'auto'}
                        w={'80%'}
                        onClick={wethMode ? handleSendWeth : handleWithdrawWeth}>
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default SendWethToOmno;
