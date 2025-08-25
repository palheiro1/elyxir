import { Stack, Text } from '@chakra-ui/react';

/**
 * @name BattlegroundStatistics
 * @description Displays a horizontal list of statistics with styled name-value pairs inside a gradient box.
 * Adapts layout and font sizes for mobile or desktop.
 * @param {Object} props - Component props.
 * @param {Array<{name: string, value: string | number}>} props.statistics - Array of statistics objects to display. Each item has a `name` and a `value`.
 * @param {boolean} props.isMobile - Flag to adjust styling and font sizes for mobile screens.
 * @returns {JSX.Element} A responsive horizontal stack showing statistics with styled text.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattlegroundStatistics = ({ statistics, isMobile }) => {
    return (
        <Stack
            mt={'40px'}
            direction="row"
            mx="auto"
            maxH={{ base: '', md: '55px' }}
            w={isMobile ? '100%' : '85%'}
            justifyContent="space-between">
            <Stack
                direction="row"
                mx="auto"
                backgroundImage="linear-gradient(180deg, rgba(86, 104, 159, 1) 0%, rgba(72, 71, 110, 1) 100%)"
                border="2px solid #D597B2"
                borderRadius="30px"
                justifyContent="space-between"
                w={{ base: '70%', md: isMobile ? '80%' : '70%' }}
                fontFamily="'Chelsea Market', system-ui">
                {statistics.map(({ name, value }, index) => (
                    <Stack
                        key={index}
                        fontSize={isMobile ? 'xs' : 'lg'}
                        p={{ base: 1, md: isMobile ? 2 : 3 }}
                        px={isMobile ? 5 : 2}
                        direction={{ base: 'column', md: 'row' }}
                        textAlign="center"
                        my="auto"
                        align="center">
                        <Text color="#FFF" flexWrap={'nowrap'}>
                            {name}:{' '}
                        </Text>
                        <Text color="#D08FB0">{value}</Text>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
};

export default BattlegroundStatistics;
