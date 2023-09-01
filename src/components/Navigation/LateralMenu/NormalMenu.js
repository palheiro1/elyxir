import { memo, useMemo, useEffect, useState } from 'react';
import { Box, Stack, Switch, Text } from '@chakra-ui/react';
import VerticalMenuButtons from './VerticalMenuButtons';
import { BLOCKTIME } from '../../../data/CONSTANTS';

const NormalMenu = memo(({ option, setOption, handleLogout, showAllCards, handleShowAllCards, nextBlock, children }) => {

    const [actualBlock, setActualBlock] = useState(nextBlock);
    const [timer, setTimer] = useState(BLOCKTIME);
    const timeText = timer === 0 ? 'SOON' : timer;
    const memoChildren = useMemo(() => children, [children]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (actualBlock === nextBlock) {
                if (timer <= 0) return;
                setTimer(timer - 1);
            } else {
                setActualBlock(nextBlock);
                setTimer(BLOCKTIME);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timer, actualBlock, nextBlock]);

    return (
        <Stack direction="row" pt={5}>
            <Box>
                <VerticalMenuButtons
                    setOption={setOption}
                    option={option}
                    handleLogout={handleLogout}
                    widthBotones="140px"
                />

                <Text fontWeight="bold" textAlign="center" fontSize="2xs" mt={2}>
                    Block in... {timeText}
                </Text>

                <Stack p={2} align="center">
                    <Text fontWeight="bold" textAlign="center" fontSize="sm">
                        Show all cards
                    </Text>
                    <Switch isChecked={showAllCards} onChange={handleShowAllCards} colorScheme="blue" />
                </Stack>
            </Box>

            {/* This is the main section */}
            <Box w="100%" px={2}>
                {memoChildren}
            </Box>
        </Stack>
    );
});

export default NormalMenu;
