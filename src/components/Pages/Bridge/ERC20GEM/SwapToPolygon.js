import { useState } from 'react';
import ethereum_address from 'ethereum-address';
import {
    Box,
    Button,
    Center,
    Divider,
    Heading,
    HStack,
    Input,
    NumberInput,
    NumberInputField,
    PinInput,
    PinInputField,
    Stack,
    Text,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';

// Utils
import { checkPin, roundNumberWithMaxDecimals, sendToPolygonBridge } from '../../../../utils/walletUtils';
import { errorToast, infoToast, okToast } from '../../../../utils/alerts';
import { GEMASSET, NQTDIVIDER } from '../../../../data/CONSTANTS';

/**
 * @name SwapToPolygon
 * @description This component is used to swap cards to Polygon
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Object} infoAccount - Account info
 * @param {String} ardorAddress - Ardor address
 * @returns {JSX.Element} - JSX element
 */
const SwapToPolygon = ({ infoAccount, ardorAddress, gemCards }) => {
    const toast = useToast();

    const [polygonAccount, setPolygonAccount] = useState('');
    const [isValidAccount, setIsValidAccount] = useState(false);
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag

    const [isSwapping, setIsSwapping] = useState(false);

    const [passphrase, setPassphrase] = useState('');
    const [gemToSwap, setGemToSwap] = useState(0);

    // const { GEMBalance } = infoAccount;
    const availableBalance = parseFloat(gemCards.unconfirmedQuantityQNT/NQTDIVIDER);

    const handleInput = e => {
        e.preventDefault();
        const { value } = e.target;
        setPolygonAccount(value);
        setIsValidAccount(ethereum_address.isAddress(value));
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

    const handleSwap = async () => {
        if (!isValidPin || !isValidAccount) return;
        infoToast('Swapping cards...', toast);
        setIsSwapping(true);

        const amountQnt = gemToSwap * NQTDIVIDER;

        const cardsToSwap = [
            {
                asset: GEMASSET,
                quantity: amountQnt,
            },
        ];

        const success = await sendToPolygonBridge({
            cards: cardsToSwap,
            ardorAccount: ardorAddress,
            ethAccount: polygonAccount,
            passPhrase: passphrase,
        });

        if (success) {
            okToast('Swap completed successfully', toast);
            setPolygonAccount('');
            setIsSwapping(false);
        } else {
            errorToast('Swap failed', toast);
        }
    };

    const textColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');

    return (
        <Center>
            <Stack direction="column" spacing={8}>
                <Heading fontSize="3xl" fontWeight="light" textAlign="center">
                    1. Select amount to swap
                </Heading>

                <Box>
                    <NumberInput
                        defaultValue={0}
                        min={0.005}
                        max={availableBalance}
                        precision={8}
                        value={gemToSwap}
                        onChange={(value) => setGemToSwap(value)}>
                        <NumberInputField />
                    </NumberInput>
                    <Center>
                        <Text color={textColor}>Maximum Available Balance to Transfer: {roundNumberWithMaxDecimals(availableBalance, 8)}</Text>
                    </Center>
                </Box>

                <Divider bgColor="#393b97" />
                <Heading fontSize="3xl" fontWeight="light" textAlign="center">
                    2. Enter your polygon address
                </Heading>

                <Input
                    isDisabled={gemToSwap === 0}
                    placeholder={gemToSwap === 0 ? 'Select amount to swap' : '0x...'}
                    value={polygonAccount}
                    onChange={handleInput}
                    isInvalid={!isValidAccount}
                />

                <Divider bgColor="#393b97" />
                <Heading fontSize="3xl" fontWeight="light" textAlign="center">
                    3. Sign and submit
                </Heading>

                <Center>
                    <HStack spacing={7}>
                        <PinInput
                            isDisabled={gemToSwap === 0 || !isValidAccount}
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
                    </HStack>
                </Center>

                <Button
                    w="100%"
                    variant="bridge"
                    disabled={!isValidAccount || !isValidPin || gemToSwap === 0 || isSwapping}
                    onClick={handleSwap}
                    letterSpacing="widest">
                    SWAP
                </Button>
            </Stack>
        </Center>
    );
};

export default SwapToPolygon;
