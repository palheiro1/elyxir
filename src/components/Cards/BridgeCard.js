import { Box, Button, Center, HStack, IconButton, Image, Input, Stack, Text, useNumberInput } from '@chakra-ui/react';

import { AiFillDelete } from 'react-icons/ai';
import CardBadges from './CardBadges';

/**
 * @name BridgeCard
 * @description Component to show the card in the bridge
 * @param {String} image - Image of the card
 * @param {String} title - Title of the card
 * @param {String} continent - Continent of the card
 * @param {String} rarity - Rarity of the card
 * @param {Boolean} needDelete - If the card is to delete
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const BridgeCard = ({ card, canEdit = false, handleDeleteSelectedCard, handleEdit, omnoQuantity }) => {
    const {
        cardImgUrl: image,
        name: title,
        asset,
        channel: continent,
        rarity,
        unconfirmedQuantityQNT: quantity,
    } = card;

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: 1,
        defaultValue: 1,
        min: 1,
        max: omnoQuantity || quantity,
    });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();

    return (
        <Stack direction={'row'} minWidth="375px" spacing={4}>
            <Image maxW="75px" src={image} alt={title} shadow="lg" rounded="sm" />

            <Stack direction={'row'} align="center" minW="35%">
                <Box>
                    <Text fontWeight="bold" fontSize="2xl">
                        {title}
                    </Text>

                    <CardBadges continent={continent} rarity={rarity} />

                    <Text color="grey">Available: {omnoQuantity || quantity}</Text>
                </Box>
            </Stack>

            {canEdit && (
                <>
                    <HStack>
                        <HStack maxW="200px" spacing={0}>
                            <Button rounded="none" {...dec} onClick={() => handleEdit(card.asset, input.value)}>
                                -
                            </Button>
                            <Input
                                rounded="none"
                                border="none"
                                textAlign="center"
                                {...input}
                                onChange={() => handleEdit(card.asset, input.value)}
                            />
                            <Button rounded="none" {...inc} onClick={() => handleEdit(card.asset, input.value)}>
                                +
                            </Button>
                        </HStack>
                        <Center>
                            <IconButton
                                aria-label="Delete"
                                onClick={() => handleDeleteSelectedCard(asset)}
                                icon={<AiFillDelete color="red" />}
                            />
                        </Center>
                    </HStack>
                </>
            )}
        </Stack>
    );
};

export default BridgeCard;
