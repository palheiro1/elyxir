import { Box, Text, Tooltip } from '@chakra-ui/react';

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
