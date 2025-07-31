import { Box, Flex, Text } from '@chakra-ui/react';
import ResponsiveTooltip from '../../../ui/ReponsiveTooltip';

/**
 * @name ListButton
 * @description Reusable styled button with optional tooltip and disabled state, used in selection
 * lists or action menus. Displays a label and handles click events unless disabled.
 * @param {Object} props - Component props.
 * @param {ReactNode} props.children - The text or element displayed inside the button.
 * @param {Function} props.onclick - Function executed when the button is clicked (if not disabled).
 * @param {Boolean} props.disabled - Whether the button is disabled; if true, the button is dimmed and unclickable.
 * @param {String} props.tooltip - Text shown in a tooltip when hovering the button.
 * @param {String} props.color - Background color of the button, passed as Chakra-compatible color value.
 * @returns {JSX.Element} A stylized clickable box with tooltip support and a centered label, reflecting disabled and active states.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const ListButton = ({ children, onclick, disabled, tooltip, color }) => {
    return (
        <Box position="relative" w="180px" h="45px" m="1">
            <Flex
                as="button"
                onClick={!disabled ? onclick : undefined}
                w="100%"
                h="100%"
                borderRadius="16px"
                backgroundColor={color}
                color="white"
                fontFamily="'Chelsea Market', system-ui"
                fontSize="16px"
                fontWeight="400"
                letterSpacing="0.05em"
                cursor={disabled ? 'default' : 'pointer'}
                opacity={disabled ? 0.3 : 1}
                align="center"
                justify="center"
                textAlign="center"
                _hover={!disabled ? { opacity: 0.8 } : {}}
                transition={'all 0.1s ease-out'}
                zIndex="1"
                position="relative">
                <Text>{children}</Text>
            </Flex>

            {tooltip && (
                <Box position="absolute" top="0" left="0" w="100%" h="100%" zIndex="2" pointerEvents="none">
                    <ResponsiveTooltip
                        label={tooltip}
                        placement="bottom"
                        hasArrow
                        bgColor="#1F2323"
                        color="#FFF"
                        p={2}
                        borderRadius="10px">
                        <Box w="100%" h="100%" />
                    </ResponsiveTooltip>
                </Box>
            )}
        </Box>
    );
};

export default ListButton;
