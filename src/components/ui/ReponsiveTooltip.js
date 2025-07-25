import {
    Tooltip,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    Box,
} from '@chakra-ui/react';

/**
 * @name ResponsiveTooltip
 * @description Tooltip component that automatically adjusts its behavior depending on the device type.
 * On desktop (non-touch devices), it renders a Chakra UI `Tooltip`.
 * On mobile or touch-enabled devices, it renders a `Popover` triggered by click,
 * allowing better usability on touchscreens.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The element that triggers the tooltip or popover.
 * @param {string | React.ReactNode} props.label - The content to show inside the tooltip or popover.
 * @param {Object} [rest] - Additional props forwarded to the Chakra UI Tooltip component.
 * @returns {JSX.Element} A responsive tooltip or popover depending on the device type.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const ResponsiveTooltip = ({ children, label, placement = 'bottom', ...rest }) => {
    const isMobile =
        typeof window !== 'undefined' &&
        (window.matchMedia('(pointer: coarse)').matches ||
            /Mobi|Android|iPhone|iPad|iPod|Tablet/i.test(navigator.userAgent));

    if (isMobile) {
        return (
            <Popover trigger="click" placement={placement}>
                <PopoverTrigger>{children}</PopoverTrigger>
                <PopoverContent
                    bg="#1F2323"
                    color="#FFF"
                    borderRadius="10px"
                    border="1px solid #585858"
                    maxW="xs"
                    p={3}
                    {...rest}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody whiteSpace="normal">{label}</PopoverBody>
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Tooltip
            label={label}
            placement={placement}
            hasArrow
            bgColor="#1F2323"
            color="#FFF"
            p={3}
            borderRadius="10px"
            border="1px solid #585858"
            {...rest}>
            <Box as="span" cursor="pointer">
                {children}
            </Box>
        </Tooltip>
    );
};

export default ResponsiveTooltip;
