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
import { checkPin, sendGEMSToOmno, withdrawGEMsFromOmno } from '../../../../../utils/walletUtils';
import { errorToast, okToast } from '../../../../../utils/alerts';
import { GEMASSET, NQTDIVIDER } from '../../../../../data/CONSTANTS';
import { getUsersState } from '../../../../../services/Ardor/omnoInterface';
import { addressToAccountId } from '../../../../../services/Ardor/ardorInterface';

const SendGEMsToOmno = ({ infoAccount, gemsModalMode, isOpen, onClose }) => {
    const { GEMBalance, accountRs } = infoAccount;

    const toast = useToast();

    const [omnoGEMsBalance, setOmnoGEMsBalance] = useState(null);
    const [amount, setAmount] = useState(0);
    const [passphrase, setPassphrase] = useState('');
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag

    useEffect(() => {
        const getOmnoGemsBalance = async () => {
            const userInfo = await getUserState();
            if (userInfo?.balance) {
                setOmnoGEMsBalance(userInfo?.balance?.asset[GEMASSET] / NQTDIVIDER || 0);
            }
        };
        getOmnoGemsBalance();
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
        if (amount <= 0) {
            return errorToast('The quantity to send must be greater than 0', toast);
        }

        let res = await sendGEMSToOmno({ quantity: amount, passPhrase: passphrase });

        if (!res) {
            return errorToast("You don't have enough IGNIS to transact");
        }
        setAmount(0);
        onClose();
        return okToast('GEMs have been sent correctly', toast);
    };
    const handleWithdrawGems = async () => {
        if (!isValidPin) {
            return errorToast('The pin is invalid', toast);
        }

        if (amount <= 0) {
            return errorToast('The quantity to withdraw must be greater than 0', toast);
        }

        let res = await withdrawGEMsFromOmno({ quantity: amount, passPhrase: passphrase });
        if (!res) {
            return errorToast("You don't have enough IGNIS to transact");
        }
        setAmount(0);
        onClose();
        return okToast('GEMs have been withdrawn correctly', toast);
    };

    const handleClose = () => {
        setAmount(0);
        onClose();
    };

    const maxAmount = gemsModalMode ? GEMBalance : omnoGEMsBalance;

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay onClose={handleClose} />
            <ModalContent bgColor={'#ebb2b9'} border={'2px solid #F48794'}>
                <ModalHeader mx={'auto'} color={'black'}>
                    {gemsModalMode ? 'SEND' : 'WITHDRAW'} GEMs
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody display={'flex'}>
                    <Stack direction={'column'} mx={'auto'}>
                        <Center>
                            <FormControl variant="floatingModalTransparent" id="Amount" my={4}>
                                <HStack spacing={0} border="1px" rounded="lg" borderColor={'#F48794'}>
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
                                        color="#FFF"
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
                        onClick={gemsModalMode ? handleSendSGEMS : handleWithdrawGems}>
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default SendGEMsToOmno;
