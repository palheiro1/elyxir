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
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    PinInput,
    PinInputField,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Stack,
    Text,
    useToast,
} from '@chakra-ui/react';

// Utils
import { checkPin, sendToPolygonBridge } from '../../../../utils/walletUtils';
import { errorToast, infoToast, okToast } from '../../../../utils/alerts';
import { GIFTZASSET } from '../../../../data/CONSTANTS';

/**
 * @name SwapToPolygon
 * @description This component is used to swap GIFTZ to Polygon
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Object} infoAccount - Account info
 * @param {String} ardorAddress - Ardor address
 * @param {Array} cards - Cards
 * @returns {JSX.Element} - JSX element
 */
const SwapToPolygon = ({ infoAccount, ardorAddress }) => {
    const toast = useToast();

    const [polygonAccount, setPolygonAccount] = useState('');
    const [isValidAccount, setIsValidAccount] = useState(false);
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag

    const [isSwapping, setIsSwapping] = useState(false);

    const [passphrase, setPassphrase] = useState('');
    const [giftzToSwap, setGiftzToSwap] = useState(0);
    const handleChange = value => setGiftzToSwap(value);

    const { GIFTZBalance } = infoAccount;

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
        if (!isValidPin || !isValidAccount || giftzToSwap === 0) return;
        infoToast('Swapping cards...', toast);
        setIsSwapping(true);

        const cardsToSwap = [
            {
                asset: GIFTZASSET,
                quantity: giftzToSwap,
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
            setGiftzToSwap(0);
            setIsSwapping(false);
        } else {
            errorToast('Swap failed', toast);
        }
    };

    return (
        <Center>
            <Stack direction="column" spacing={8} align="center">
                <Box>
                    <Heading fontSize="3xl" fontWeight="light">
                        1. Select <strong>GIFTZ</strong>
                    </Heading>
                    <Text fontWeight="light" textAlign="center">
                        to swap
                    </Text>
                </Box>

                <Stack>
                    <NumberInput w="100%" value={giftzToSwap} min={1} max={GIFTZBalance} onChange={handleChange}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Slider
                        flex="1"
                        focusThumbOnChange={false}
                        value={giftzToSwap}
                        min={1}
                        max={GIFTZBalance}
                        onChange={handleChange}>
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb fontSize="sm" boxSize="32px" children={giftzToSwap} />
                    </Slider>
                </Stack>

                <Divider bgColor="#393b97" />
                <Heading fontSize="3xl" fontWeight="light" textAlign="center">
                    2. Enter your polygon address
                </Heading>

                <Input
                    isDisabled={giftzToSwap === 0}
                    placeholder={giftzToSwap === 0 ? 'Select GIFTZ amount first' : '0x...'}
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
                            isDisabled={giftzToSwap === 0 || !isValidAccount}
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
                    isDisabled={!isValidAccount || !isValidPin || giftzToSwap === 0 || isSwapping}
                    onClick={handleSwap}
                    letterSpacing="widest">
                    SWAP
                </Button>
            </Stack>
        </Center>
    );
};

export default SwapToPolygon;
