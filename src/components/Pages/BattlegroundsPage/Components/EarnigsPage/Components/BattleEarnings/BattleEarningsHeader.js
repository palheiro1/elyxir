import { Grid, GridItem, Image, Select, Stack, Text } from '@chakra-ui/react';

/**
 * @name BattleEarningsHeader
 * @description Renders the header section for the battle earnings display, including
 * columns for date, arena selection, and reward types (GEM, WETH, and Cards).
 * Provides a responsive layout that adjusts font sizes based on the
 * `isMobile` flag. Allows the user to select an arena from a dropdown,
 * triggering the `setSelectedArena` callback when changed.
 * @param {Object} props - Component props.
 * @param {boolean} props.isMobile - Flag to apply mobile-specific styles.
 * @param {number} props.selectedArena - Currently selected arena ID.
 * @param {function} props.setSelectedArena - Setter function for arena selection.
 * @param {Array<Object>} props.arenas - List of arena objects with `arenaId` and `name`.
 * @returns {JSX.Element} The header grid with labeled columns and arena selector.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleEarningsHeader = ({ isMobile, selectedArena, setSelectedArena, arenas }) => {
    return (
        <Grid
            templateColumns="repeat(5, 1fr)"
            gap={4}
            w={'90%'}
            mx={'auto'}
            mt={3}
            p={1}
            borderRadius={'10px'}
            border={'2px solid #C1A34C'}
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
                <Select
                    variant={'unstyled'}
                    value={selectedArena}
                    onChange={e => setSelectedArena(Number(e.target.value))}
                    textAlign={'center'}
                    textTransform={'uppercase'}
                    fontFamily={'Inter, System'}
                    fontWeight={700}
                    fontSize={isMobile ? 'sm' : 'md'}
                    mx="auto">
                    {arenas
                        ? arenas.map(arena => (
                              <option
                                  key={arena.arenaId}
                                  value={arena.arenaId}
                                  style={{
                                      backgroundColor: '#FFF',
                                      color: '#000',
                                  }}>
                                  {arena.name}
                              </option>
                          ))
                        : 'ALL LANDS'}
                </Select>
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
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                    CARDS
                </Text>
            </GridItem>
        </Grid>
    );
};

export default BattleEarningsHeader;
