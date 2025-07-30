import { GridItem, IconButton, Stack, Text } from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';

const FilterLandsCell = ({ value, isMobile, isUppercase = false, padding = 3, onclick, ...rest }) => {
    return (
        <GridItem colSpan={1} textAlign="center" w={'80px'} mx={'auto'}>
            <Stack
                p={padding}
                maxH="45px"
                fontFamily="Inter, System"
                fontWeight={700}
                h="100%"
                fontSize={isMobile ? 'xs' : 'md'}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                direction={'row'}
                textTransform={isUppercase ? 'uppercase' : 'none'}
                {...rest}>
                <Text>{value}</Text>
                <IconButton color={'#FFF'} icon={<FiEye />} bg={'transparent'} onClick={onclick} />
            </Stack>
        </GridItem>
    );
};

export default FilterLandsCell;
