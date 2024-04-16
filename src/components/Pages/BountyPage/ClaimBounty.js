import { useEffect, useRef, useState } from 'react';
import { Box, Button, Center, Heading, Text, useDisclosure } from '@chakra-ui/react';
import BountyDialog from '../../Modals/BountyDialog/ClaimBountyDialog';
import { IGNIS_REQUIRED } from '../../../data/CONSTANTS';

/**
 * @name ClaimBounty
 * @description Component to claim the bounty
 * @param {String} username - String with the username
 * @param {Number} totalCards - Number with the total cards
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const ClaimBounty = ({ username, cards, haveIgnis }) => {
    const [haveLockedCards, setHaveLockedCards] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const reference = useRef();

    useEffect(() => {
        const checkCards = () => {
            const lockedCards = cards.some(
                card =>
                    Number(card.quantityQNT) > Number(card.unconfirmedQuantityQNT) &&
                    Number(card.unconfirmedQuantityQNT) === 0
            );
            setHaveLockedCards(lockedCards);
        };

        cards && checkCards();
    }, [cards]);

    return (
        <>
            <Box mt={8} textAlign="center">
                <Heading>Congratulations!</Heading>
                <Center>
                    <Box textAlign="center">
                        <Text fontSize="xs">You can participate in the Bounty, you have all the necessary cards.</Text>
                    </Box>
                </Center>

                {haveLockedCards && (
                    <Center>
                        <Box my={8} p={4} border="1px" borderColor="red" rounded="md">
                            <Text fontWeight="bolder" color="yellow.500">
                                LOCKED CARS DETECTED.
                            </Text>
                            <Text fontSize="xs" fontWeight="bold">
                                Ask orders or slow transactions may cause the issue.
                            </Text>
                            <Text fontSize="xs" fontWeight="bold">
                                Please, <strong>close ask orders and wait for transactions to complete.</strong>
                            </Text>
                        </Box>
                    </Center>
                )}

                {!haveIgnis && (
                    <Center>
                        <Box my={8} p={4} border="1px" borderColor="red" rounded="md">
                            <Text fontWeight="bolder" color="yellow.500">
                                YOU DO NOT HAVE ENOUGH IGNIS
                            </Text>
                            <Text fontSize="xs" fontWeight="bold">
                                At least <strong>{IGNIS_REQUIRED} IGNIS</strong> are required to participate in the
                                Bounty.
                            </Text>
                        </Box>
                    </Center>
                )}

                {haveIgnis && !haveLockedCards && (
                    <Button
                        p={8}
                        px={16}
                        m={2}
                        my={8}
                        size="lg"
                        onClick={onOpen}
                        isDisabled={!haveIgnis || haveLockedCards}>
                        CLAIM BOUNTY
                    </Button>
                )}
            </Box>
            {isOpen && (
                <BountyDialog
                    isOpen={isOpen}
                    onClose={onClose}
                    reference={reference}
                    username={username}
                    totalCards={cards}
                />
            )}
        </>
    );
};

export default ClaimBounty;
