import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';

/**
 * @name PotionPlaceholder
 * @description React component that displays a visual placeholder for when no potion is selected.
 * It includes a dashed box with a "+" symbol to invite user interaction and a "Use Potion" button
 * to trigger the potion selection modal. Fully responsive using `useBattlegroundBreakpoints`.
 * @param {Function} onPotionModalOpen - Callback function that opens the potion selection modal.
 * @returns {JSX.Element} Placeholder UI to prompt the user to select a potion.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const PotionPlaceholder = ({ onPotionModalOpen }) => {
    const { isMobile } = useBattlegroundBreakpoints();
    return (
        <Stack direction={'row'} spacing={3} align={'center'}>
            <Box
                w={isMobile ? '50px' : '60px'}
                h={isMobile ? '50px' : '60px'}
                borderRadius="md"
                border="3px dashed #D597B2"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ borderColor: '#F48794' }}
                onClick={onPotionModalOpen}>
                <Text color={'#D597B2'} fontSize={'2xl'} fontFamily={'Chelsea Market, system-ui'}>
                    +
                </Text>
            </Box>
            <Stack spacing={1}>
                <Text color={'#FFF'} fontFamily={'Chelsea Market, system-ui'} fontSize={isMobile ? 'sm' : 'md'}>
                    No Potion Selected
                </Text>
                <Button
                    size="sm"
                    variant="solid"
                    colorScheme="purple"
                    onClick={onPotionModalOpen}
                    _hover={{ transform: 'scale(1.05)' }}
                    transition="transform 0.2s">
                    Use Potion
                </Button>
            </Stack>
        </Stack>
    );
};

export default PotionPlaceholder;
