import { Center, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import FlowItem from './FlowItem';
import MenuButton from './MenuButton';
import { useNavigate } from 'react-router-dom';
import { IS_BOUNTY_ENABLED } from '../../../../data/CONSTANTS';

const Buttons = () => {
    const textBuy = useColorModeValue('#9f3772', 'white');
    const textOpen = useColorModeValue('#e094b3', 'white');
    const textHistory = useColorModeValue('#3b7197', 'white');
    const textInventory = useColorModeValue('#2f8190', 'white');
    const textBounty = useColorModeValue('#3b5397', 'white');

    const navigate = useNavigate();

    return (
        <Center>
            <SimpleGrid columns={{ base: 1, md: 3, xl: 4, '2xl': 5 }} spacing={4} p={4}>
                <FlowItem
                    number={1}
                    title={`Obtain cards by`}
                    subtitle={`purchasing GIFTZ`}
                    color={textBuy}
                    button={
                        <MenuButton
                            bgColor={'#B60DC4'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(182, 13, 196, 0.75)'}
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
                            bgColor={'#8E059A'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(142, 5, 154, 0.75)'}
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
                            bgColor={'#E25339'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(226, 83, 57, 0.75)'}
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
                            bgColor={'#E1632C'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(225, 99, 44, 0.75)'}
                            icon={'/images/icons/menu/blanco/inventory.png'}
                            isActive={false}
                            text={'Inventory'}
                            onClick={() => navigate('/home?goToSection=1')}
                        />
                    }
                />

                <FlowItem
                    number={5}
                    title="The Bounty: Your Ultimate Challenge!"
                    color={textBounty}
                    button={
                        <MenuButton
                            bgColor={'#E53055'}
                            fontWeight={'bold'}
                            hoverBg={'rgba(229, 48, 85, 0.75)'}
                            icon={'/images/icons/menu/blanco/bounty.png'}
                            isActive={false}
                            text={'Bounty'}
                            onClick={() => navigate('/home?goToSection=5')}
                            isDisabled={!IS_BOUNTY_ENABLED}
                        />
                    }
                />
            </SimpleGrid>
        </Center>
    );
};

export default Buttons;
