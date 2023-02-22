import { Box, Button, Heading, Spacer, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { getAllMessages } from '../../../services/Ardor/ardorInterface';
import NewMessage from '../../Modals/NewMessage/NewMessage';
import Messages from './Messages';
import Warning from './Warning';

const ArdorChat = ({ infoAccount }) => {
    const [messages, setMessages] = useState([]);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const ref = useRef();

    useEffect(() => {
        const getMessages = async () => {
            const response = await getAllMessages(infoAccount.accountRs);
            // Delete messages have JSON format
            response.prunableMessages = response.prunableMessages.filter(message => {
                console.log("🚀 ~ file: ArdorChat.js:19 ~ getMessages ~ message:", message)
                if (message.message) return message.message.indexOf('{') === -1;
                if (message.encryptedMessage) return true;
                return false;
            });
            setMessages(response.prunableMessages);
        };
        getMessages();
    }, [infoAccount.accountRs]);

    const handleNewMessage = () => {
        onOpen();
    };

    return (
        <>
            <Box>
                <Warning />
                <Stack direction={['column', 'row']} spacing={4} mt={4}>
                    <Stack direction="column" spacing={0}>
                        <Heading fontSize="md">
                            Messages
                        </Heading>
                        <Text fontSize="xs">
                            Total messages: <b>{messages.length}</b>
                        </Text>
                    </Stack>
                    <Spacer />
                    <Button size="sm" onClick={handleNewMessage}>
                        New message
                    </Button>
                </Stack>
                <Messages messages={messages} username={infoAccount.name} account={infoAccount.accountRs} />
            </Box>
            <NewMessage reference={ref} isOpen={isOpen} onClose={onClose} username={infoAccount.name} />
        </>
    );
};

export default ArdorChat;
