import { Grid, GridItem, Image, Stack, Text } from '@chakra-ui/react';

/**
 * @name LeaderboardEarningsHeader
 * @description Displays the header row for the leaderboard earnings table with columns:
 * Date, Phanteon, GEM, WETH, MANA, GIFTZ, and Special Cards.
 * Includes icons next to the currency labels and adapts font sizes for mobile view.
 * The header is sticky to remain visible on scroll.
 * @param {Object} props - Component props.
 * @param {boolean} props.isMobile - Flag indicating if the display is on a mobile device, affects font sizes.
 * @returns {JSX.Element} The rendered header grid component.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const LeaderboardEarningsHeader = ({ isMobile }) => {
    return (
        <Grid
            templateColumns="repeat(7, 1fr)"
            gap={4}
            w={'90%'}
            mx={'auto'}
            mt={3}
            p={1}
            borderRadius={'10px'}
            border={'2px solid #BBC4D3'}
            color={'#FFF'}
            bgColor={'inherit'}
            position="sticky"
            top="0"
            zIndex={1}>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                    DATE
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                    PHANTEON
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Stack direction={'row'} w={'fit-content'} mx={'auto'}>
                    <Text fontFamily={'Inter, System'} my={'auto'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        GEM
                    </Text>
                    <Image src="/images/currency/gem.png" boxSize={'30px'} />
                </Stack>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Stack direction={'row'} w={'fit-content'} mx={'auto'}>
                    <Text fontFamily={'Inter, System'} my={'auto'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        WETH
                    </Text>
                    <Image src="/images/currency/weth.png" boxSize={'30px'} />
                </Stack>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Stack direction={'row'} w={'fit-content'} mx={'auto'}>
                    <Text fontFamily={'Inter, System'} my={'auto'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        MANA
                    </Text>
                    <Image src="/images/currency/mana.png" boxSize={'30px'} />
                </Stack>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Stack direction={'row'} w={'fit-content'} mx={'auto'}>
                    <Text fontFamily={'Inter, System'} my={'auto'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        GIFTZ
                    </Text>
                    <Image src="/images/currency/giftz.png" boxSize={'30px'} />
                </Stack>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                    SPECIAL CARDS
                </Text>
            </GridItem>
        </Grid>
    );
};

export default LeaderboardEarningsHeader;
