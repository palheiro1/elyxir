import { Box, Button, Center, Heading, Spacer, Stack, useDisclosure } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { getAllMessages } from '../../../services/Ardor/ardorInterface';
import NewMessage from '../../Modals/NewMessage/NewMessage';
import Messages from './Messages';
import Warning from './Warning';
import { ALL_ACCOUNTS } from '../../../data/CONSTANTS';

const ArdorChat = ({ infoAccount }) => {
    const [messages, setMessages] = useState([]);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const ref = useRef();

    useEffect(() => {
        const getMessages = async () => {
            const response = await getAllMessages(infoAccount.accountRs);
            let auxMessages = response.prunableMessages;

            // Delete messages have JSON format
            auxMessages = auxMessages.filter(message => {
                if (message.senderRS === infoAccount.accountRs) return false;
                if (ALL_ACCOUNTS.includes(message.senderRS)) return false;
                if (message.encryptedMessage) return true;
                // Delete my own messages
                return false;
            });

            // Group by senderRS
            auxMessages = auxMessages.reduce((acc, message) => {
                const sender = message.senderRS;
                if (!acc[sender]) {
                    acc[sender] = [];
                }
                acc[sender].push(message);
                return acc;
            }, {});

            setMessages(auxMessages);
        };
        getMessages();
    }, [infoAccount.accountRs]);

    const handleNewMessage = () => {
        onOpen();
    };

    return (
        <>
            <Box mb={2}>
                <Warning />
                <Stack direction={['column', 'row']} spacing={4} mt={4}>
                    <Center>
                        <Heading fontSize="md">Messages</Heading>
                    </Center>
                    <Spacer />
                    <Button size="sm" onClick={handleNewMessage} bgColor={"rgba(59,67,151,0.5)"}>
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
