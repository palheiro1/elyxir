import { GridItem, IconButton, Stack, Text } from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';

const FilterLandsCell = ({ value, isMobile, isUppercase = false, padding = 3, onclick, ...rest }) => {
    return (
        <GridItem colSpan={1} textAlign="center">
            <Stack
                p={padding}
                maxH="45px"
                fontFamily="Inter, System"
                fontWeight={700}
                h="100%"
                fontSize={isMobile ? 'xs' : 'md'}
                display="flex"
                alignItems="center"
                justifyContent="center"
                direction={'row'}
                textTransform={isUppercase ? 'uppercase' : 'none'}
                {...rest}>
                <Text>{value}</Text>
                <IconButton color={'#FFF'} icon={<FiEye />} bg={'transparent'} onClick={onclick} ml={2} />
            </Stack>
        </GridItem>
    );
};

export default FilterLandsCell;
