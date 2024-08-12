import React, { useEffect, useState } from 'react';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import { Box, Button, Heading, IconButton, Spinner, Stack } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { getLeaderboards } from '../../../../../services/Battlegrounds/Battlegrounds';
import Leaderboard from './Leaderboard';

const Leaderboards = ({ handleClose, isMobile }) => {
    const [leaderboards, setLeaderboards] = useState(null);
    const [viewData, setViewData] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchLeaderboards = async () => {
            const res = await getLeaderboards();
            setLeaderboards(res);
        };
        fetchLeaderboards();
    }, []);

    const changeData = option => {
        if (leaderboards) {
            let data = {
                type: null,
                info: [],
            };
            switch (option) {
                case 1:
                    data.type = 'general';
                    data.info = leaderboards.general;
                    break;
                case 2:
                    data.type = 'terrestrial';
                    data.info = leaderboards.terrestrial;
                    break;
                case 3:
                    data.type = 'aerial';
                    data.info = leaderboards.aerial;
                    break;
                case 4:
                    data.type = 'aquatic';
                    data.info = leaderboards.aquatic;
                    break;
                default:
                    break;
            }
            setData(data);
            setViewData(true);
        }
    };

    const handleGoBack = () => {
        setData(null);
        setViewData(false);
    };

    const availableLeaderboards = [
        {
            name: 'General',
            option: 1,
        },
        {
            name: 'Terrestrial',
            option: 2,
        },
        {
            name: 'Aerial',
            option: 3,
        },
        {
            name: 'Aquatic',
            option: 4,
        },
    ];

    return (
        <>
            <Overlay isVisible={true} handleClose={handleClose} />
            <Box
                pos={'fixed'}
                bgColor={'#1F2323'}
                zIndex={99}
                w={isMobile ? '80%' : '70%'}
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
                    onClick={handleClose}
                />
                {leaderboards ? (
                    <>
                        {!viewData ? (
                            <Stack
                                direction={'column'}
                                color={'#FFF'}
                                my={5}
                                mx={'auto'}
                                textAlign={'center'}
                                h={'90%'}>
                                <Heading fontFamily={'Chelsea Market, System'} fontWeight={100}>
                                    LEADERBOARDS
                                </Heading>

                                <Stack m={'auto'}>
                                    {availableLeaderboards.map(({ name, option }, index) => (
                                        <Button key={index} onClick={() => changeData(option)}>
                                            {name}
                                        </Button>
                                    ))}
                                </Stack>
                            </Stack>
                        ) : (
                            <Leaderboard data={data} handleGoBack={handleGoBack} isMobile={isMobile} />
                        )}
                    </>
                ) : (
                    <Box
                        h={'100%'}
                        position={'absolute'}
                        color={'#FFF'}
                        alignContent={'center'}
                        top={'50%'}
                        left={'50%'}
                        w={'100%'}
                        textAlign={'center'}
                        transform={'translate(-50%, -50%)'}>
                        <Spinner color="#FFF" w={20} h={20} />
                    </Box>
                )}
            </Box>
        </>
    );
};

export default Leaderboards;
