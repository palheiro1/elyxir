import { Stack, Text } from '@chakra-ui/react';
import { NQTDIVIDER } from '../../../../../../../../data/CONSTANTS';
import { isEmptyObject } from '../../../../../../../../utils/utils';

/**
 * @name TributeDisplay
 * @description Displays the tribute cost required to start a battle. It shows each asset's cost and
 * visually indicates if the user's balance for that asset is sufficient or insufficient
 * using the `checkBalance` function to set the text color.
 * If there is no cost (empty or undefined battleCost), it displays "FREE".
 * @param {boolean} isMobile - Flag to adjust font sizes and layout for mobile view.
 * @param {Array} battleCost - Array of asset objects containing `price` and `name`.
 * @param {Function} checkBalance - Function that returns a color string based on the user's balance
 *                                  compared to the asset price.
 * @returns {JSX.Element} The styled tribute display component.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
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
