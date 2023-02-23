import { Box, Button, Center, Spacer, Stack, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { useRef } from 'react';
import { formatMessageTimestamp } from '../../../utils/dateAndTime';
import { getMessageTimestamp } from '../../../utils/txUtils';
import DecryptMessage from '../../Modals/DecryptMessage/DecryptMessage';

const OneMessage = ({ message, username, account }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const ref = useRef();

    const { message: textMsg, senderRS, encryptedMessage } = message;

    const timestamp = getMessageTimestamp(message);
    // Returns the time elapsed since arrival (hours, minutes, seconds...) or the date if it's older than 24 hours
    // Compare with actual time
    const timeElapsed = new Date() - new Date(timestamp);
    const hours = Math.floor(timeElapsed / 3600000); // 1 hora = 3600000 milisegundos
    const minutes = Math.floor((timeElapsed % 3600000) / 60000); // 1 minuto = 60000 milisegundos
    const seconds = Math.floor((timeElapsed % 60000) / 1000); // 1 segundo = 1000 milisegundos

    let timeElapsedText = '';
    let isDate = false;
    if (hours > 24) {
        isDate = true;
        timeElapsedText = formatMessageTimestamp(timestamp);
    } else if (hours === 0) {
        if (minutes === 0) {
            timeElapsedText = `${seconds}s`;
        } else {
            timeElapsedText = `${minutes}m ${seconds}s`;
        }
    } else {
        timeElapsedText = `${hours}h ${minutes}m ${seconds}s`;
    }

    const handleDecrypt = () => {
        onOpen();
    };

    const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
    const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
    const hoverColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    return (
        <>
            <Box rounded="lg" py={4} shadow="md" border="1px" bgColor={bgColor} borderColor={borderColor} _hover={{ bgColor: hoverColor, shadow: "lg" }}>
                <Stack direction={['column', 'row']} mx={4}>
                    <Center>
                        <Text align="center">{senderRS}</Text>
                    </Center>
                    <Spacer />
                    <Box>
                        <Text align="left">
                            Received <strong>{timeElapsedText}</strong> {!isDate && 'ago'}
                        </Text>
                    </Box>
                    <Spacer />
                    <Center>
                        {encryptedMessage ? (
                            <Button variant="outline" size="sm" onClick={handleDecrypt}>
                                Click to decrypt conversation
                            </Button>
                        ) : (
                            <Text align="center">{textMsg}</Text>
                        )}
                    </Center>
                </Stack>
            </Box>
            <DecryptMessage
                reference={ref}
                isOpen={isOpen}
                onClose={onClose}
                username={username}
                message={message}
                account={account}
            />
        </>
    );
};

export default OneMessage;
