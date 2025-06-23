import { Box, Text, Tooltip } from '@chakra-ui/react';
import React from 'react';

const ListButton = ({ children, onclick, disabled, isExit, tooltip }) => {
    const bgGradient = isExit
        ? 'linear-gradient(218deg,rgba(223, 158, 166, 1) 0%, rgba(153, 64, 104, 1) 100%)'
        : 'linear-gradient(194deg, rgba(127, 192, 190, 1) 42%, rgba(86, 104, 159, 1) 100%)';

    const borderGradient = isExit
        ? 'linear-gradient(55deg,rgba(223, 158, 166, 1) 0%, rgba(153, 64, 104, 1) 100%)'
        : 'linear-gradient(55deg, rgba(127, 192, 190, 1) 42%, rgba(86, 104, 159, 1) 100%)';
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
                background={borderGradient}
                p="3px">
                <Box
                    borderRadius="14px"
                    background={bgGradient}
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
                    color="white"
                    textShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                    boxShadow="inset 0 2px 4px rgba(0, 0, 0, 0.2)">
                    <Text m="auto" fontSize="md">
                        {children}
                    </Text>
                </Box>
            </Box>
        </Tooltip>
    );
};

export default ListButton;
