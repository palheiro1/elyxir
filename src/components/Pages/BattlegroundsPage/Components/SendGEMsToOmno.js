import React from 'react';
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
} from '@chakra-ui/react';

const SendGEMsToOmno = ({
    isOpen,
    onClose,
    decrement,
    amount,
    handleChange,
    maxAmount,
    increment,
    handleCompletePin,
    isValidPin,
    handleSendSGEMS,
    handleWithdrawGems,
    gemsModalMode,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{gemsModalMode ? 'Send' : 'Withdraw'} GEMs</ModalHeader>
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
                                    <Text color={'#000'}>Amount to send (max: {maxAmount})</Text>
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
                    <Button colorScheme="blue" mr={3} onClick={gemsModalMode ? handleSendSGEMS : handleWithdrawGems}>
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default SendGEMsToOmno;
