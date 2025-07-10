import { Center, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import FlowItem from './FlowItem';
import MenuButton from './MenuButton';
import { useNavigate } from 'react-router-dom';
import { IS_BOUNTY_ENABLED } from '../../../../data/CONSTANTS';
import { useSelector } from 'react-redux';

const Buttons = () => {
    const textBuy = useColorModeValue('#9F3772', 'white');
    const textOpen = useColorModeValue('#E094B3', 'white');
    const textHistory = useColorModeValue('#3B7197', 'white');
    const textInventory = useColorModeValue('#2F8190', 'white');
    const textBounty = useColorModeValue('#3B6497', 'white');
    const textBattlegrounds = useColorModeValue('#BCC754', 'white');

    const navigate = useNavigate();

    const { cards } = useSelector(state => state.cards);

    return (
        <Center>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 3, '2xl': 6 }} spacing={4} p={4}>
                <FlowItem
                    number={1}
                    title={`Obtain cards by`}
                    subtitle={`purchasing GIFTZ`}
                    color={textBuy}
                    button={
                        <MenuButton
                            bgColor={'#9F3772'}
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
                            bgColor={'#E094B3'}
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
                            bgColor={'#3B7197'}
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
                            bgColor={'#2F8190'}
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
                    title="The Jackpot: Win Rewards!"
                    color={textBounty}
                    button={
                        <MenuButton
                            bgColor={'#3B6497'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(59, 100, 151, 0.75)'}
                            icon={'/images/icons/menu/blanco/bounty.png'}
                            isActive={false}
                            text={'Jackpot'}
                            onClick={() => navigate('/home?goToSection=5')}
                            isDisabled={!IS_BOUNTY_ENABLED}
                        />
                    }
                />

                <FlowItem
                    number={6}
                    title="Battlegrounds: Ultimate Challenge!"
                    color={textBattlegrounds}
                    button={
                        <MenuButton
                            bgColor={'#BCC754'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(188, 199, 84, 0.75)'}
                            icon={'/images/icons/menu/blanco/battlegrounds.svg'}
                            isActive={false}
                            onClick={() => navigate('/battlegrounds')}
                            isLoading={!cards || cards.length <= 0}
                        />
                    }
                />
            </SimpleGrid>
        </Center>
    );
};

export default Buttons;
