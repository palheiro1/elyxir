import { memo, useMemo, useEffect, useState } from 'react';
import { Box, Stack, Switch, Text } from '@chakra-ui/react';
import VerticalMenuButtons from './VerticalMenuButtons';
import { BLOCKTIME } from '../../../data/CONSTANTS';
import { useSelector } from 'react-redux';

const NormalMenu = memo(
    ({
        option,
        setOption,
        handleLogout,
        showAllCards,
        handleShowAllCards,
        children,
        cardsLoaded,
        setSelectedBridgeType,
    }) => {
        const { prev_height } = useSelector(state => state.blockchain);
        const [actualBlock, setActualBlock] = useState(prev_height);
        const [timer, setTimer] = useState(BLOCKTIME);
        const timeText = timer === 0 ? 'SOON' : timer;
        const memoChildren = useMemo(() => children, [children]);

        useEffect(() => {
            const interval = setInterval(() => {
                if (actualBlock === prev_height) {
                    if (timer <= 0) return;
                    setTimer(timer - 1);
                } else {
                    setActualBlock(prev_height);
                    setTimer(BLOCKTIME);
                }
            }, 1000);
            return () => clearInterval(interval);
        }, [timer, actualBlock, prev_height]);

        return (
            <Stack direction="row" pt={5}>
                <Box>
                    <VerticalMenuButtons
                        setOption={setOption}
                        option={option}
                        handleLogout={handleLogout}
                        buttonsWidth="150px"
                        cardsLoaded={cardsLoaded}
                        setSelectedBridgeType={setSelectedBridgeType}
                    />

                    <Text fontWeight="bold" textAlign="center" fontSize="2xs" mt={2}>
                        Block in... {timeText}
                    </Text>

                    <Stack p={2} align="center">
                        <Text fontWeight="bold" textAlign="center" fontSize="sm">
                            Show all cards
                        </Text>
                        <Switch isChecked={showAllCards} onChange={handleShowAllCards} variant="mbswitch" />
                    </Stack>
                </Box>

                {/* This is the main section */}
                <Box w="100%" px={2}>
                    {memoChildren}
                </Box>
            </Stack>
        );
    }
);

export default NormalMenu;
