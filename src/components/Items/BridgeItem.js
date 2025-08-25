import { useState } from 'react';
import {
    Box,
    Button,
    Center,
    HStack,
    IconButton,
    Image,
    Input,
    Stack,
    Text,
    useColorModeValue,
    useNumberInput,
} from '@chakra-ui/react';
import { AiFillDelete } from 'react-icons/ai';

/**
 * @name BridgeItem
 * @description Item component for battlegrounds inventory
 * @param {Object} item - Item object
 * @param {Boolean} canEdit - Boolean to know if the item can be edited
 * @param {Function} handleDeleteSelectedItem - Function to handle delete selected item
 * @param {Function} handleEdit - Function to handle edit
 * @returns {JSX.Element} - JSX element
 */
const BridgeItem = ({ item, canEdit = true, handleDeleteSelectedItem, handleEdit }) => {
    const {
        id,
        name: title,
        image,
        rarity,
        type,
        quantity,
    } = item;

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: 1,
        defaultValue: item.selectQuantity || 1,
        min: 1,
        max: quantity,
    });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();
    const textColor = useColorModeValue(!canEdit ? 'black' : 'white', canEdit ? 'white' : 'white');

    const getRarityColor = (rarity) => {
        const colors = {
            'Common': '#8B8B8B',
            'Rare': '#4A90E2',
            'Epic': '#9B59B6',
            'Legendary': '#F39C12',
            'Special': '#F39C12',
        };
        return colors[rarity] || colors['Common'];
    };

    return (
        <Stack direction={'row'} minWidth="375px" spacing={4}>
            <Image maxW="75px" src={image} alt={title} shadow="lg" rounded="sm" fallbackSrc="/images/items/WaterCristaline copia.png" />

            <Stack direction={'row'} align="center" minW="35%">
                <Box>
                    <Text fontWeight="bold" fontSize="2xl" textColor={textColor}>
                        {title}
                    </Text>
                    <Stack direction="row" spacing={1}>
                        <Text
                            px={2}
                            fontSize="sm"
                            bgColor={getRarityColor(rarity)}
                            rounded="lg"
                            color="white">
                            {rarity}
                        </Text>
                        <Text
                            px={2}
                            fontSize="sm"
                            bgColor="gray.600"
                            rounded="lg"
                            color="white">
                            {type}
                        </Text>
                    </Stack>
                    <Text color="grey">Available: {quantity}</Text>
                </Box>
            </Stack>

            {canEdit && (
                <>
                    <HStack ml={2}>
                        <HStack maxW="200px" spacing={0}>
                            <Button rounded="none" {...dec} onClick={() => handleEdit(item, input.value)}>
                                -
                            </Button>
                            <Input
                                rounded="none"
                                border="none"
                                textAlign="center"
                                disabled={true}
                                {...input}
                                onChange={() => handleEdit(item, input.value)}
                            />
                            <Button rounded="none" {...inc} onClick={() => handleEdit(item, input.value)}>
                                +
                            </Button>
                        </HStack>
                        <Center>
                            <IconButton
                                aria-label="Delete"
                                onClick={() => handleDeleteSelectedItem(item)}
                                icon={<AiFillDelete color="red" />}
                            />
                        </Center>
                    </HStack>
                </>
            )}
        </Stack>
    );
};

export default BridgeItem;