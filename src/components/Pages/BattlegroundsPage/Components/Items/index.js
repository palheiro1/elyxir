import Modal from '../../../../ui/Modal';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';
import ItemsPage from './Components/ItemsPage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const ItemsInventory = ({ infoAccount, onClose }) => {
    const { isMobile, isLittleScreen, isMediumScreen } = useBattlegroundBreakpoints();
    const { items } = useSelector(state => state.items);
    const gridColumns = useMemo(() => {
        if (isMobile) return 2;
        if (isMediumScreen) return 4;
        if (isLittleScreen) return 3;
        return 5;
    }, [isMobile, isLittleScreen, isMediumScreen]);

    return (
        <Modal isVisible onClose={onClose} width={isMobile ? '100%' : '98%'} height={isMobile ? '100%' : '90%'} p={4}>
            <ItemsPage infoAccount={infoAccount} gridColumns={gridColumns} isMobile={isMobile} items={items} />
        </Modal>
    );
};

export default ItemsInventory;
