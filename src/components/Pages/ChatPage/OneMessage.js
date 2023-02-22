import { Box, Button, Center, SimpleGrid, Text, useDisclosure } from '@chakra-ui/react';
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

    return (
        <>
            <Box bgColor="whiteAlpha.200" rounded="lg" py={2}>
                <SimpleGrid columns={3} spacing={4}>
                    <Center>
                        <Text align="center">{senderRS}</Text>
                    </Center>

                    <Text>
                        Received <strong>{timeElapsedText}</strong> {!isDate && 'ago'}
                    </Text>

                    {encryptedMessage ? (
                        <Button variant="outline" size="sm" mx={12} onClick={handleDecrypt}>
                            Click to decrypt conversation
                        </Button>
                    ) : (
                        <Text align="center">{textMsg}</Text>
                    )}
                </SimpleGrid>
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
