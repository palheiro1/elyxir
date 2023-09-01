import { Box, Button, Center, SimpleGrid, Text, useDisclosure } from '@chakra-ui/react';
import { useRef } from 'react';
import DecryptMessage from '../../Modals/DecryptMessage/DecryptMessage';
import { getMessageTimestamp } from '../../../utils/dateAndTime';
import { TARASCACARDACCOUNT } from '../../../data/CONSTANTS';

const OneSenderMessages = ({ sender, messages, username, account }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const ref = useRef();

    const { timeElapsedText, isDate } = getMessageTimestamp(messages[0]);

    const bgColor = 'rgba(59, 67, 151, 0.25)';
    const borderColor = 'rgba(59, 67, 151, 1)';
    const hoverColor = 'rgba(59, 67, 151, 0.155)';

    const fixedSender = sender === TARASCACARDACCOUNT ? 'Mythical Being’s official' : sender;

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
                        <Button variant="ghost" size="lg" onClick={onOpen} w="90%">
                            READ
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
