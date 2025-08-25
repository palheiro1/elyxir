import Modal from '../../../../ui/Modal';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';
import ItemsPage from './Components/ItemsPage';
import { useMemo } from 'react';

const ItemsInventory = ({ infoAccount, onClose }) => {
    const { isMobile, isLittleScreen, isMediumScreen } = useBattlegroundBreakpoints();

    const gridColumns = useMemo(() => {
        if (isMobile) return 2;
        if (isMediumScreen) return 4;
        if (isLittleScreen) return 3;
        return 5;
    }, [isMobile, isLittleScreen, isMediumScreen]);

    const mockItems = [
        {
            id: 'whispering-gale',
            name: 'Whispering Gale Potion',
            bonus: 1,
            target: 'element',
            medium: 2,
            usage: '1 match',
            description: 'Bottled winds from dragon peaks. Grants swiftness to creatures of the sky.',
            image: '/images/items/Lava copia.png',
            quantity: 1,
        },
        {
            id: 'tideheart',
            name: 'Tideheart Potion',
            bonus: 1,
            target: 'element',
            medium: 3,
            image: '/images/items/Wind copia.png',
            usage: '1 match',
            quantity: 34,
            description: 'Drawn from ocean springs. Binds life force to the tides.',
        },
        {
            id: 'stoneblood',
            name: 'Stoneblood Potion',
            bonus: 1,
            target: 'element',
            medium: 1,
            usage: '1 match',
            quantity: 2,
            image: '/images/items/SalivadeRahu copia.png',
            description: 'Distilled from molten world roots. Steadies land-bound warriors.',
        },
        {
            id: 'eternal-silk',
            name: 'Potion of the Eternal Silk',
            bonus: 1,
            target: 'domain',
            domain: 1,
            usage: '1 match',
            description: 'Lotus dew and moonlight threads empower ancient beings.',
            quantity: 2,
            image: '/images/items/AlcoholBeer copia.png',
        },
        {
            id: 'coral-spirits',
            name: 'Potion of the Coral Spirits',
            bonus: 1,
            target: 'domain',
            domain: 2,
            usage: '1 match',
            description: 'Deep-sea chants lift island spirits above fate.',
            quantity: 2,
            image: '/images/items/Water sea.png',
        },
        {
            id: 'feathered-flame',
            name: 'Potion of the Feathered Flame',
            bonus: 1,
            target: 'domain',
            domain: 3,
            usage: '1 match',
            description: 'Phoenix fire and sky feathers restore the fallen.',
            quantity: 2,
            image: '/images/items/Blood copia.png',
        },
        {
            id: 'shifting-dunes',
            name: 'Potion of the Shifting Dunes',
            bonus: 1,
            target: 'domain',
            domain: 4,
            usage: '1 match',
            description: 'Desert spirits help the underdog rise like a sandstorm.',
            quantity: 2,
            image: '/images/items/Holi Water2 copia.png',
        },
        {
            id: 'forgotten-grove',
            name: 'Potion of the Forgotten Grove',
            bonus: 1,
            target: 'domain',
            domain: 5,
            usage: '1 match',
            description: 'Forest whispers mask the order of ancient tricksters.',
            quantity: 2,
            image: '/images/items/WaterCristaline copia.png',
        },
    ];

    return (
        <Modal isVisible onClose={onClose} width={isMobile ? '100%' : '98%'} height={isMobile ? '100%' : '90%'} p={4}>
            <ItemsPage infoAccount={infoAccount} gridColumns={gridColumns} isMobile={isMobile} items={mockItems} />
        </Modal>
    );
};

export default ItemsInventory;
