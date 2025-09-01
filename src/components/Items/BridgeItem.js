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
import { getColor, getTypeValue } from './data';

/**
 * @name BridgeItem
 * @description Item component for battlegrounds inventory
 * @param {Object} item - Item object
 * @param {Boolean} canEdit - Boolean to know if the item can be edited
 * @param {Function} handleDeleteSelectedItem - Function to handle delete selected item
 * @param {Function} handleEdit - Function to handle edit
 * @returns {JSX.Element} - JSX element
 */
const BridgeItem = ({ item, canEdit = true, handleDeleteSelectedItem, handleEdit, withdraw }) => {
    const { name, description, imgUrl, bonus } = item;

    const quantityKey = withdraw ? 'omnoQuantity' : 'quantityQNT';
    const maxQNT = item[quantityKey];

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: 1,
        defaultValue: item.selectQuantity || 1,
        min: 1,
        max: maxQNT,
        onChange: (valueAsString, valueAsNumber) => handleEdit(item, valueAsNumber),
    });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();

    const textColor = useColorModeValue(!canEdit ? 'black' : 'white', canEdit ? 'white' : 'white');

    return (
        <Stack direction={'row'} minWidth="375px" spacing={4}>
            <Image
                maxW="75px"
                src={imgUrl}
                alt={name}
                shadow="lg"
                rounded="sm"
                fallbackSrc="/images/items/WaterCristaline copia.png"
            />

            <Stack direction={'row'} align="center" minW="32%">
                <Box>
                    <Text fontWeight="bold" fontSize="2xl" textColor={textColor} noOfLines={1}>
                        {description}
                    </Text>
                    <Stack direction="row" spacing={1}>
                        <Text
                            px={2}
                            fontSize="sm"
                            bgColor={getColor(bonus)}
                            rounded="lg"
                            color="white"
                            textTransform={'capitalize'}>
                            {bonus.type} ({getTypeValue(bonus)})
                        </Text>
                    </Stack>
                    <Text color="grey">Available: {item[quantityKey]}</Text>
                </Box>
            </Stack>

            {canEdit && (
                <>
                    <HStack ml={2}>
                        <HStack maxW="200px" spacing={0}>
                            <Button rounded="none" {...dec}>
                                -
                            </Button>
                            <Input rounded="none" border="none" textAlign="center" {...input} />
                            <Button rounded="none" {...inc}>
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
