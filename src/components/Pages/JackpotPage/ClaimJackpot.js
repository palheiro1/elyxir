import { Box, Button, Center, Heading, Text, useDisclosure } from '@chakra-ui/react';
import { useRef } from 'react';
import JackpotDialog from '../../Modals/JackpotDialog/JackpotDialog';

/**
 * @name ClaimJackpot
 * @description Component to claim the jackpot
 * @param {String} username - String with the username
 * @param {Number} totalCards - Number with the total cards
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const ClaimJackpot = ({ username, totalCards }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const reference = useRef();

    const haveLockedCards = false;

    return (
        <>
            <Box mt={8} textAlign="center">
                <Heading>Congratulations!</Heading>
                <Center>
                    <Box textAlign="center">
                        <Text fontSize="xs">You have all the cards!</Text>
                    </Box>
                </Center>

                {haveLockedCards ? (
                    <Center>
                        <Box my={8} p={4} border="1px" borderColor="red" rounded="md">
                            <Text fontWeight="bolder" color="yellow.500">
                                LOCKED CARS DETECTED.
                            </Text>
                            <Text fontSize="xs" fontWeight="bold">
                                Ask orders or slow transactions may cause the issue.
                            </Text>
                            <Text fontSize="xs" fontWeight="bold">
                                Please, close ask orders and wait for transactions to complete.
                            </Text>
                        </Box>
                    </Center>
                ) : (
                    <Button p={8} px={16} m={2} my={8} size="lg" onClick={onOpen}>
                        CLAIM JACKPOT
                    </Button>
                )}
            </Box>
            <JackpotDialog
                isOpen={isOpen}
                onClose={onClose}
                reference={reference}
                username={username}
                totalCards={totalCards}
            />
        </>
    );
};

export default ClaimJackpot;
