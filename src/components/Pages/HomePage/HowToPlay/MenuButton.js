import { Box, Button, Image, Stack, Text } from '@chakra-ui/react';

const MenuButton = ({ icon, text, onClick, bgColor, hoverBg, textColor, fontWeight, isActive, isDisabled }) => {
    return (
        <Stack direction={'column'}>
            <Button
                key={text}
                minW={'140px'}
                maxW={'160px'}
                color="white"
                minH="50px"
                _hover={{ background: hoverBg, color: 'white' }}
                bgColor={bgColor}
                textColor={textColor}
                onClick={isDisabled ? null : onClick}>
                <Stack direction="row" align="center" w="100%">
                    <Box minW={'2rem'}>
                        <Image src={icon} w={isActive ? '30px' : '25px'} />
                    </Box>
                    <Text fontSize="sm" fontWeight={fontWeight} color="white">
                        {text}
                    </Text>
                </Stack>
            </Button>
            {isDisabled && (
                <Text fontSize="2xs" fontWeight="bold" color="red" textAlign={"center"}>
                    OFF - waiting new season
                </Text>
            )}
        </Stack>
    );
};

export default MenuButton;
