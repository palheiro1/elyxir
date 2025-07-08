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

const ResponsiveTooltip = ({ children, label, ...rest }) => {
    const isMobile =
        typeof window !== 'undefined' &&
        (window.matchMedia('(pointer: coarse)').matches ||
            /Mobi|Android|iPhone|iPad|iPod|Tablet/i.test(navigator.userAgent));

    if (isMobile) {
        return (
            <Popover trigger="click" placement="bottom">
                <PopoverTrigger>{children}</PopoverTrigger>
                <PopoverContent
                    bg="#1F2323"
                    color="#FFF"
                    borderRadius="10px"
                    border="1px solid #585858"
                    maxW="xs"
                    p={3}>
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
            placement="bottom"
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
