import { memo, useMemo, useEffect, useState } from 'react';
import { Box, Stack } from '@chakra-ui/react';
import VerticalMenuButtons from './VerticalMenuButtons';
import { BLOCKTIME } from '../../../data/CONSTANTS';
import { useSelector } from 'react-redux';

const NormalMenu = memo(({ option, setOption, handleLogout, children, cardsLoaded, setSelectedBridgeType }) => {
    const { prev_height } = useSelector(state => state.blockchain);
    const [actualBlock, setActualBlock] = useState(prev_height);
    const [timer, setTimer] = useState(BLOCKTIME);
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
            <Box mb={3}>
                <VerticalMenuButtons
                    setOption={setOption}
                    option={option}
                    handleLogout={handleLogout}
                    buttonsWidth="150px"
                    cardsLoaded={cardsLoaded}
                    setSelectedBridgeType={setSelectedBridgeType}
                />
            </Box>

            {/* This is the main section */}
            <Box w="100%" px={2}>
                {memoChildren}
            </Box>
        </Stack>
    );
});

export default NormalMenu;
