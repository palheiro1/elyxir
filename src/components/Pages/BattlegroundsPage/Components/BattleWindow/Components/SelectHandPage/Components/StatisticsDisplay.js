import locations from '../../../../../assets/LocationsEnum';
import { Image, Stack, Text } from '@chakra-ui/react';
import { getContinentIcon, getLevelIconString, getMediumIcon } from '../../../../../Utils/BattlegroundsUtils';

const StatisticsDisplay = ({ medium, domainName, arenaId, isMobile }) => {
    const statistics = [
        { name: 'Level', value: locations[arenaId - 1].rarity },
        { name: 'Medium', value: medium },
        { name: 'Continent', value: domainName },
    ];

    const getImageSrc = (name, value) => {
        if (name === 'Level') return getLevelIconString(value);
        if (name === 'Medium') return getMediumIcon(value);
        if (name === 'Continent') return getContinentIcon(value);
        return null;
    };
    return (
        <Stack
            direction={'row'}
            mx={'auto'}
            mt={isMobile ? 1 : 4}
            fontSize={'md'}
            justify="space-between"
            textAlign={'center'}
            w={isMobile ? '80%' : '60%'}>
            {statistics.map(({ name, value }, index) => (
                <Stack direction={'column'} key={index} textAlign={'center'} my={2} mx={'auto'}>
                    <Stack
                        backgroundColor={'#5A679B'}
                        direction={'row'}
                        border={'2px solid #D597B2'}
                        borderRadius={'40px'}
                        color={'#FFF'}
                        letterSpacing={1}
                        w={isMobile ? '120px' : '155px'}
                        fontSize={isMobile ? 'xs' : 'md'}
                        textAlign={'center'}
                        textTransform={'uppercase'}
                        fontFamily={'Chelsea Market, system-ui'}
                        p={isMobile ? 1 : 2}>
                        <Image src={getImageSrc(name, value)} boxSize={isMobile ? '20px' : '30px'} />
                        <Text m={'auto'}>{value}</Text>
                    </Stack>
                </Stack>
            ))}
        </Stack>
    );
};

export default StatisticsDisplay;
