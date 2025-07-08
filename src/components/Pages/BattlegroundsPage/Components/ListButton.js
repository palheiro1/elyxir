import { Box, Text, Tooltip } from '@chakra-ui/react';

/**
 * @name ListButton
 * @description Reusable styled button with optional tooltip and disabled state, used in selection
 * lists or action menus. Displays a label and handles click events unless disabled.
 * @param {ReactNode} children - The text or element displayed inside the button.
 * @param {Function} onclick - Function executed when the button is clicked (if not disabled).
 * @param {Boolean} disabled - Whether the button is disabled; if true, the button is dimmed and unclickable.
 * @param {String} tooltip - Text shown in a tooltip when hovering the button.
 * @param {String} color - Background color of the button, passed as Chakra-compatible color value.
 * @returns {JSX.Element} A stylized clickable box with tooltip support and a centered label, reflecting disabled and active states.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const ListButton = ({ children, onclick, disabled, tooltip, color }) => {
    return (
        <Tooltip
            label={tooltip}
            placement="bottom"
            hasArrow
            bgColor={'#1F2323'}
            color={'#FFF'}
            p={2}
            borderRadius={'10px'}>
            <Box
                m={1}
                w="180px"
                h="45px"
                position="relative"
                borderRadius="16px"
                cursor={disabled ? 'default' : 'pointer'}
                title={disabled ? 'Coming soon...' : undefined}
                onClick={disabled ? undefined : onclick}
                opacity={disabled ? 0.3 : 1}
                backgroundColor={color}
                p="3px">
                <Box
                    borderRadius="14px"
                    backgroundColor={color}
                    w="100%"
                    h="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontFamily="'Chelsea Market', system-ui"
                    fontWeight="400"
                    fontSize="16px"
                    lineHeight="1"
                    letterSpacing="0.05em"
                    color="white">
                    <Text m="auto" fontSize="md">
                        {children}
                    </Text>
                </Box>
            </Box>
        </Tooltip>
    );
};

export default ListButton;
