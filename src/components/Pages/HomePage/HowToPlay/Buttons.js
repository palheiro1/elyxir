import { Center, Stack, useColorModeValue } from '@chakra-ui/react';
import FlowItem from './FlowItem';
import MenuButton from './MenuButton';
import { useNavigate } from 'react-router-dom';

const Buttons = () => {
    const textBuy = useColorModeValue('#9f3772', 'white');
    const textOpen = useColorModeValue('#e094b3', 'white');
    const textHistory = useColorModeValue('#3b7197', 'white');
    const textInventory = useColorModeValue('#2f8190', 'white');
    const textJackpot = useColorModeValue('#3b5397', 'white');

    const navigate = useNavigate();

    return (
        <Center>
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                spacing={{ base: 4, md: 0, lg: 12, xl: 32 }}
                mb={6}
                align={'center'}>
                <FlowItem
                    number={1}
                    title={`Obtain cards by`}
                    subtitle={`purchasing GIFTZ`}
                    color={textBuy}
                    button={
                        <MenuButton
                            bgColor={'#9f3772'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(159, 55, 114, 0.75)'}
                            icon={'/images/icons/menu/BuyPack.png'}
                            isActive={false}
                            text={'Buy Pack'}
                            onClick={() => navigate('/home?goToSection=7')}
                        />
                    }
                />
                <FlowItem
                    number={2}
                    title="Redeem packs for"
                    subtitle={'5 random cards'}
                    color={textOpen}
                    button={
                        <MenuButton
                            bgColor={'#e094b3'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(224, 148, 179, 0.75)'}
                            icon={'/images/icons/menu/OpenPack.png'}
                            isActive={false}
                            text={'Open pack'}
                            onClick={() => navigate('/home?goToSection=11')}
                        />
                    }
                />
                <FlowItem
                    number={3}
                    title="Check out"
                    subtitle={'your history'}
                    color={textHistory}
                    button={
                        <MenuButton
                            bgColor={'#3b7197'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(59, 113, 151, 0.75)'}
                            icon={'/images/icons/menu/blanco/history.png'}
                            isActive={false}
                            text={'History'}
                            onClick={() => navigate('/home?goToSection=2')}
                        />
                    }
                />
                <FlowItem
                    number={4}
                    title="Investigate"
                    subtitle="your inventory"
                    color={textInventory}
                    button={
                        <MenuButton
                            bgColor={'#2f8190'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(47, 129, 144, 0.75)'}
                            icon={'/images/icons/menu/blanco/inventory.png'}
                            isActive={false}
                            text={'Inventory'}
                            onClick={() => navigate('/home?goToSection=1')}
                        />
                    }
                />

                <FlowItem
                    number={5}
                    title="The Jackpot: Your Ultimate Challenge!"
                    color={textJackpot}
                    button={
                        <MenuButton
                            bgColor={'#3b5397'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(59, 83, 151, 0.75)'}
                            icon={'/images/icons/menu/blanco/jackpot.png'}
                            isActive={false}
                            text={'Jackpot'}
                            onClick={() => navigate('/home?goToSection=5')}
                        />
                    }
                />
            </Stack>
        </Center>
    );
};

export default Buttons;