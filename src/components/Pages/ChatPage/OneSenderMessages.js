import { Box, Button, Center, SimpleGrid, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { useRef } from 'react';
import DecryptMessage from '../../Modals/DecryptMessage/DecryptMessage';
import { getMessageTimestamp } from '../../../utils/dateAndTime';

const OneSenderMessages = ({ sender, messages, username, account }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const ref = useRef();

    const { timeElapsedText, isDate } = getMessageTimestamp(messages[0]);

    const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
    const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
    const hoverColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    const fixedSender = sender === 'ARDOR-5NCL-DRBZ-XBWF-DDN5T' ? 'Mythical Being’s official' : sender;

    return (
        <>
            <Box
                rounded="lg"
                py={4}
                shadow="md"
                border="1px"
                bgColor={bgColor}
                borderColor={borderColor}
                _hover={{ bgColor: hoverColor, shadow: 'lg' }}>
                <SimpleGrid columns={3} spacing={4}>
                    <Center>
                        <Text align="center">{fixedSender}</Text>
                    </Center>
                    <Center>
                        <Text align="left">
                            Last message: <strong>{timeElapsedText}</strong> {!isDate && 'ago'}
                        </Text>
                    </Center>
                    <Center>
                        <Button variant="outline" size="md" onClick={onOpen}>
                            Read conversation
                        </Button>
                    </Center>
                </SimpleGrid>
            </Box>
            {isOpen && (
                <DecryptMessage
                    reference={ref}
                    isOpen={isOpen}
                    onClose={onClose}
                    username={username}
                    messages={messages}
                    sender={sender}
                    account={account}
                />
            )}
        </>
    );
};

export default OneSenderMessages;
