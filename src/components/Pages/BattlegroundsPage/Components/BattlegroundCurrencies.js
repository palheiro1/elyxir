import {
    Box,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Portal,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { NQTDIVIDER } from '../../../../data/CONSTANTS';
import { wEthDecimals } from '../data';

/**
 * @name BattlegroundCurrencies
 * @description Displays the user's in-game currency balances (IGNIS, wETH, GEM) in a responsive horizontal menu.
 * Each currency includes its icon, formatted balance, and for wETH and GEM, a dropdown with options to send or withdraw tokens via modals.
 * @param {Object} props - Props object.
 * @param {boolean} props.isMobile - Indicates if the layout is mobile to adjust margin and responsiveness.
 * @param {number|string} props.IGNISBalance - Current IGNIS balance of the player.
 * @param {number|string} props.parseWETH - Parsed wETH balance from the blockchain (in NQT).
 * @param {number|string} props.omnoGEMsBalance - GEM balance in NQT format to be displayed.
 * @param {Function} props.handleOpenWethModal - Callback to open the wETH modal with a given mode ('Send' | 'Withdraw').
 * @param {Function} props.handleOpenGemsModal - Callback to open the GEM modal with a given mode ('Send' | 'Withdraw').
 * @returns {JSX.Element} A `Stack` with styled currency boxes or dropdowns depending on the token type.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattlegroundCurrencies = ({
    isMobile,
    IGNISBalance,
    parseWETH,
    omnoGEMsBalance,
    handleOpenWethModal,
    handleOpenGemsModal,
}) => {
    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
    const bgColor = useColorModeValue('rgba(234, 234, 234, 0.5)', 'rgba(234, 234, 234, 1)');
    return (
        <Stack direction="row" ml="5%">
            {/* IGNIS */}
            <Box
                zIndex={1}
                color="black"
                my="auto"
                bgColor={bgColor}
                borderColor={borderColor}
                rounded="full"
                w="6rem"
                minW="68px"
                ml={isMobile && 3}
                maxH="1.5rem">
                <Stack direction="row" align="center" mt={-2}>
                    <Image ml={-3} src="images/currency/ignis.png" alt="IGNIS Icon" w="40px" h="40px" />
                    <Text ml={-2}>{Number(IGNISBalance).toFixed(0)}</Text>
                </Stack>
            </Box>

            {/* wETH */}
            <Menu>
                <MenuButton
                    zIndex={1}
                    color="black"
                    my="auto"
                    bgColor={bgColor}
                    borderColor={borderColor}
                    rounded="full"
                    w="6rem"
                    minW="68px"
                    ml={isMobile && 3}
                    mx={4}
                    maxH="1.5rem">
                    <Stack direction="row" align="center">
                        <Image
                            ml={-3}
                            src="images/battlegrounds/currencies/ETHBattle.svg"
                            alt="wETH Icon"
                            w="40px"
                            h="40px"
                        />
                        <Text ml={parseWETH !== 0 ? -3 : 2}>
                            {parseWETH &&
                                (parseWETH / NQTDIVIDER).toFixed(Math.max(0, wEthDecimals <= 6 ? wEthDecimals : 6))}
                        </Text>
                    </Stack>
                </MenuButton>
                <Portal>
                    <MenuList zIndex={10}>
                        <MenuItem onClick={() => handleOpenWethModal('Send')}>Send WETH to Battlegrounds</MenuItem>
                        <MenuItem onClick={() => handleOpenWethModal('Withdraw')}>
                            Withdraw WETH from Battlegrounds
                        </MenuItem>
                    </MenuList>
                </Portal>
            </Menu>

            {/* GEM */}
            <Menu>
                <MenuButton
                    zIndex={1}
                    my="auto"
                    color="black"
                    bgColor={bgColor}
                    borderColor={borderColor}
                    rounded="full"
                    minW="68px"
                    w="6rem"
                    ml={isMobile && 3}
                    maxH="1.5rem">
                    <Stack direction="row" align="center">
                        <Image
                            ml={-3}
                            src="images/battlegrounds/currencies/GEMBattle.svg"
                            alt="GEM Icon"
                            w="40px"
                            h="40px"
                        />
                        <Text>{(omnoGEMsBalance / NQTDIVIDER).toFixed(0)}</Text>
                    </Stack>
                </MenuButton>
                <Portal>
                    <MenuList zIndex={10}>
                        <MenuItem onClick={() => handleOpenGemsModal('Send')}>Send GEM to Battlegrounds</MenuItem>
                        <MenuItem onClick={() => handleOpenGemsModal('Withdraw')}>
                            Withdraw GEM from Battlegrounds
                        </MenuItem>
                    </MenuList>
                </Portal>
            </Menu>
        </Stack>
    );
};

export default BattlegroundCurrencies;
