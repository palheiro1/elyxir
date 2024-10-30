import { CloseIcon } from '@chakra-ui/icons';
import { Box, Heading, IconButton, Image, Select, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import BattlesEarnigs from './BattlesEarnigs';
import LeaderboardsEarnigs from './LeaderboardsEarnigs';

const Earnings = ({ infoAccount, isMobile, closeEarnigs, cards }) => {
    const [option, setOption] = useState(1);

    return (
        <>
            <Overlay isVisible={true} handleClose={closeEarnigs} />
            <Box
                pos={'fixed'}
                bgColor={'#1F2323'}
                zIndex={99}
                w={'80%'}
                h={'90%'}
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
                        maxW={'150px'}
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
                            PANTHEON
                        </option>
                    </Select>
                    <Heading fontFamily={'Chelsea market'} flex="1" fontWeight={400}>
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
