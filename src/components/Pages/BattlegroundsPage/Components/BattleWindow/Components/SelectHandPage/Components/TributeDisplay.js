import { Stack, Text } from '@chakra-ui/react';
import { isEmptyObject } from '../../../../../Utils/BattlegroundsUtils';
import { NQTDIVIDER } from '../../../../../../../../data/CONSTANTS';

const TributeDisplay = ({ isMobile, battleCost, checkBalance }) => {
    return (
        <Stack direction={'row'} spacing={8} my={'auto'}>
            <Text
                color={'#D597B2'}
                my={'auto'}
                fontFamily={'Chelsea Market, system-ui'}
                fontSize={isMobile ? 'md' : 'lg'}>
                TRIBUTE
            </Text>
            <Stack
                direction={'column'}
                my={'auto'}
                ml={2}
                fontFamily={'Inter, system-ui'}
                w={isMobile && '100px'}
                fontWeight={500}
                fontSize={isMobile ? 'xs' : 'sm'}>
                {battleCost && !isEmptyObject(battleCost) ? (
                    battleCost.map((item, index) => (
                        <Text key={index} color={checkBalance(item)}>
                            {item.price / NQTDIVIDER} {item.name}
                        </Text>
                    ))
                ) : (
                    <Text color={'#FFF'}>FREE</Text>
                )}
            </Stack>
        </Stack>
    );
};

export default TributeDisplay;
