import { Box, Button, Heading, Spacer, Stack, useDisclosure } from '@chakra-ui/react';
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
            console.log('🚀 ~ file: ArdorChat.js:18 ~ getMessages ~ response:', response);
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
                    <Heading fontSize="md" mt={4}>
                        Unread messages
                    </Heading>
                    <Spacer />
                    <Button size="sm" onClick={handleNewMessage}>
                        New message
                    </Button>
                </Stack>
                <Messages messages={messages} />
            </Box>
            <NewMessage reference={ref} isOpen={isOpen} onClose={onClose} username={infoAccount.name} />
        </>
    );
};

export default ArdorChat;
