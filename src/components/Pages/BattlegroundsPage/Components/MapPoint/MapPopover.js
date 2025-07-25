import {
    Box,
    Button,
    Image,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    Portal,
    Square,
    Stack,
    Text,
    Tooltip,
    useToast,
} from '@chakra-ui/react';
import { useBattlegroundBreakpoints } from '../../../../../hooks/useBattlegroundBreakpoints';
import {
    formatAddress,
    getContinentIcon,
    getLevelIconInt,
    getLevelIconString,
    getMediumIcon,
    getMediumIconInt,
    getTimeDifference,
} from '../../Utils/BattlegroundsUtils';
import { useCallback } from 'react';
import { copyToast } from '../../../../../utils/alerts';
import { useSelector } from 'react-redux';

/**
 * @name MapPopover
 * @description A popover component that displays detailed information about a battleground arena,
 * including arena level, medium, defender info and cards, with interactive features
 * like copying defender's address to clipboard and starting a battle.
 * @param {Object} props - Component props.
 * @param {Object} props.arena - The arena data object.
 * @param {string} props.name - The name of the arena.
 * @param {number|string} props.medium - Medium identifier for icon display.
 * @param {Object} props.defenderInfo - Information about the defender (name, accountRS).
 * @param {function} props.handleClose - Function to close the popover.
 * @param {Array} props.defenderCards - Array of defender's cards.
 * @param {function} props.clickButton - Callback triggered when "Start a Battle" button is clicked.
 * @param {boolean} props.myArena - Whether the arena belongs to the current user, disables battle.
 * @returns {JSX.Element} The Popover UI element with arena details and action button.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const MapPopover = ({ arena, name, medium, defenderInfo, handleClose, defenderCards, clickButton, myArena }) => {
    const { isMobile } = useBattlegroundBreakpoints();
    const toast = useToast();
    const { soldiers } = useSelector(state => state.soldiers);

    const copyToClipboard = useCallback(
        address => {
            navigator.clipboard.writeText(address);
            copyToast('ARDOR address', toast);
        },
        [toast]
    );
    return (
        <Portal>
            <PopoverContent backgroundColor={'#5A679B'} border={'none'} h={isMobile && '300px'}>
                <PopoverArrow backgroundColor={'#202323'} />
                <PopoverHeader
                    fontFamily={'Chelsea Market, system-ui'}
                    bgColor={'#202323'}
                    borderTopRadius={'inherit'}
                    textAlign={'center'}
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'center'}>
                    <Stack direction={'row'} mx={'auto'} p={2} w={'90%'} justifyContent={'space-between'}>
                        <Image
                            src={getLevelIconString(arena.rarity)}
                            w={'10%'}
                            bgColor={'#FFF'}
                            borderRadius={'full'}
                        />
                        <Text textTransform={'uppercase'} color={'#EBB2B9'} fontSize={isMobile ? 'sm' : 'lg'}>
                            {name}
                        </Text>
                        <Image src={getMediumIcon(medium)} w={'10%'} />
                    </Stack>
                    <Tooltip label={`Copy: ${defenderInfo.accountRS}`} hasArrow placement="right">
                        <Text
                            textTransform={'uppercase'}
                            color={'#FFF'}
                            fontSize={isMobile ? 'sm' : 'lg'}
                            onClick={() => copyToClipboard(defenderInfo.accountRS)}>
                            GUARDIAN: {defenderInfo.name || formatAddress(defenderInfo.accountRS)}{' '}
                        </Text>
                    </Tooltip>
                </PopoverHeader>
                <PopoverCloseButton onClick={handleClose} />
                <PopoverBody
                    fontFamily={'Chelsea Market, system-ui'}
                    display={'flex'}
                    justifyContent={'center'}
                    flexDir={'column'}
                    gap={5}
                    overflowY={isMobile && 'scroll'}
                    bgColor={'#5A679B'}
                    mx={'auto'}>
                    <Stack direction={'column'} mt={isMobile && '300px'} mx={'auto'} w={'80%'}>
                        {defenderCards.map((card, index) => {
                            let cardSoldier = soldiers.soldier.find(soldier => soldier.asset === card.asset);
                            return (
                                <Stack direction={'row'} key={index} my={1}>
                                    <Image
                                        aspectRatio={1}
                                        borderRadius={'10px'}
                                        w={'60px'}
                                        key={card.asset}
                                        src={card.cardThumbUrl}
                                        border={'3px solid #FFF'}
                                    />
                                    <Stack direction={'column'} ml={2}>
                                        <Text
                                            color={'#FFF'}
                                            textTransform={'capitalize'}
                                            fontFamily={'Inter, system-ui'}
                                            fontWeight={'700'}
                                            fontSize={'md'}>
                                            {card.name}
                                        </Text>
                                        <Stack direction={'row'} w={'80%'} justifyContent={'space-between'}>
                                            <Image
                                                src={getContinentIcon(card.channel)}
                                                w={'20%'}
                                                maxH={'30px'}
                                                p={0.5}
                                                borderRadius={'3px'}
                                                bgColor={'#FFF'}
                                            />
                                            <Image src={getMediumIconInt(cardSoldier.mediumId)} w={'20%'} />
                                            <Square w={'20%'}>
                                                <Image
                                                    src={getLevelIconInt(cardSoldier.power)}
                                                    borderRadius={'full'}
                                                    bgColor={'#FFF'}
                                                />
                                            </Square>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            );
                        })}
                    </Stack>
                </PopoverBody>
                <PopoverFooter bgColor={'#202323'} borderBottomRadius={'inherit'} p={5} textAlign={'center'}>
                    <Tooltip hasArrow label={myArena ? `You can't fight against yourself` : null} placement="right">
                        <Box
                            mx="auto"
                            borderRadius="30px"
                            p="3px"
                            _hover={myArena ? { backgroundColor: '#484848' } : { backgroundColor: 'whiteAlpha.100' }}
                            background="linear-gradient(49deg, rgba(235,178,185,1) 0%, rgba(32,36,36,1) 100%)"
                            display="inline-block">
                            <Button
                                color={'#FFF'}
                                isDisabled={myArena}
                                sx={{
                                    background: 'linear-gradient(224.72deg, #5A679B 12.32%, #5A679B 87.76%)',
                                    borderRadius: '30px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    padding: '3',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                }}
                                fontFamily={'Chelsea market'}
                                fontWeight={400}
                                onClick={clickButton}>
                                START A BATTLE
                            </Button>
                        </Box>
                    </Tooltip>
                    {arena.conquestEconomicCluster.timestamp && arena.conquestEconomicCluster.timestamp !== 0 ? (
                        <Text mt={4} fontSize={'sm'}>
                            Last conquered:{' '}
                            <span
                                style={{
                                    fontWeight: 'bold',
                                }}>
                                {getTimeDifference(arena.conquestEconomicCluster.timestamp, false)}{' '}
                            </span>
                            ago
                        </Text>
                    ) : null}
                </PopoverFooter>
            </PopoverContent>
        </Portal>
    );
};

export default MapPopover;
