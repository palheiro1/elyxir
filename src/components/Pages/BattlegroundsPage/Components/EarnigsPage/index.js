import { CloseIcon } from '@chakra-ui/icons';
import { Box, Heading, IconButton, Image, Select, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { Overlay } from '../../../../ui/Overlay';
import BattlesEarnigs from './Components/BattleEarnings';
import LeaderboardsEarnigs from './Components/LeaderboardEarnings';
import { useBattlegroundBreakpoints } from '../../../../../hooks/useBattlegroundBreakpoints';

/**
 * @name Earnings
 * @description Main earnings modal component that displays either battle earnings or pantheon leaderboard earnings
 * based on user selection. It renders a modal overlay with a close button, a select dropdown to switch
 * between "Battles" and "Pantheons", and the corresponding earnings component below.
 * The modal is centered and scrollable with responsive styling for mobile.
 * @param {Object} props - Component props.
 * @param {Object} props.infoAccount - User account information.
 * @param {Function} props.closeEarnigs - Function to close the earnings modal.
 * @param {Array} props.cards - Array of user cards for display in earnings components.
 * @returns {JSX.Element} Earnings modal component.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const Earnings = ({ infoAccount, closeEarnigs, cards }) => {
    const [option, setOption] = useState(1);
    const { isMobile } = useBattlegroundBreakpoints();
    return (
        <>
            <Overlay isVisible={true} handleClose={closeEarnigs} />
            <Box
                pos={'fixed'}
                bgColor={'#1F2323'}
                zIndex={99}
                w={isMobile ? '90%' : '80%'}
                h={isMobile ? '95%' : '90%'}
                borderRadius={'25px'}
                overflowY={'scroll'}
                className="custom-scrollbar"
                top={'50%'}
                left={'50%'}
                transform={'translate(-50%, -50%)'}>
                <IconButton
                    background={'transparent'}
                    color={'#FFF'}
                    icon={<CloseIcon />}
                    _hover={{ background: 'transparent' }}
                    position="absolute"
                    top={2}
                    right={2}
                    zIndex={999}
                    onClick={closeEarnigs}
                />
                <Stack
                    direction={'row'}
                    w={'90%'}
                    mt={5}
                    mx={'auto'}
                    textAlign={'center'}
                    justifyContent="space-between"
                    alignItems="center">
                    <Select
                        value={option}
                        onChange={e => setOption(Number(e.target.value))}
                        color={'#000'}
                        letterSpacing={2}
                        bgColor={'#FFF'}
                        zIndex={999}
                        fontFamily={'Chelsea Market, System'}
                        _hover={{ borderColor: '#555' }}
                        maxW={'160px'}
                        flex="1">
                        <option
                            value={1}
                            style={{
                                backgroundColor: '#FFF',
                                color: '#000',
                            }}>
                            BATTLES
                        </option>
                        <option
                            value={2}
                            style={{
                                backgroundColor: '#FFF',
                                color: '#000',
                            }}>
                            PANTHEONS
                        </option>
                    </Select>
                    <Heading fontFamily={'Chelsea market'} flex="1" fontWeight={400} size={isMobile ? 'lg' : 'xl'}>
                        EARNINGS
                    </Heading>
                    <Image src={`/images/battlegrounds/coins2.svg`} flex="1" maxW="120px" maxH={'80px'} />
                </Stack>
                {option === 1 && <BattlesEarnigs infoAccount={infoAccount} cards={cards} isMobile={isMobile} />}
                {option === 2 && <LeaderboardsEarnigs infoAccount={infoAccount} cards={cards} isMobile={isMobile} />}
            </Box>
        </>
    );
};

export default Earnings;
