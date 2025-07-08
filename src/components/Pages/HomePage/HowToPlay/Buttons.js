import { Center, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import FlowItem from './FlowItem';
import MenuButton from './MenuButton';
import { useNavigate } from 'react-router-dom';
import { IS_BOUNTY_ENABLED } from '../../../../data/CONSTANTS';
import { useSelector } from 'react-redux';

const Buttons = () => {
    const textBuy = useColorModeValue('#84BBA4', 'white');
    const textOpen = useColorModeValue('#6EB2BB', 'white');
    const textHistory = useColorModeValue('#CE99B4', 'white');
    const textInventory = useColorModeValue('#96A8B9', 'white');
    const textBounty = useColorModeValue('#C76D8E', 'white');
    const textBattlegrounds = useColorModeValue('#BEC671', 'white');

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
                            bgColor={'#84BBA4'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(132, 187, 164, 0.75)'}
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
                            bgColor={'#6EB2BB'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(110, 178, 187, 0.75)'}
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
                            bgColor={'#CE99B4'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(206, 153, 180, 0.75)'}
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
                            bgColor={'#96A8B9'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(150, 168, 185, 0.75)'}
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
                            bgColor={'#C76D8E'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(199, 109, 142, 0.75)'}
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
                            bgColor={'#BEC671'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(190, 198, 113, 0.75)'}
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
