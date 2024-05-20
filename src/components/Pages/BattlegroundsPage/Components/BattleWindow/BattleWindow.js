import { Box, IconButton } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CloseIcon } from '@chakra-ui/icons';
import Inventory from '../../../InventoryPage/Inventory';
import { addressToAccountId } from '../../../../../services/Ardor/ardorInterface';
import { SelectHandPage } from './SelectHandPage';
import { Overlay } from '../BattlegroundsIntro/Overlay';

export const BattleWindow = ({ arenaInfo }) => {
    const [openIventory, setOpenIventory] = useState(false);

    const handleOpenInventory = index => {
        console.log('Index clicked:', index);
        setOpenIventory(true);
    };

    useEffect(() => {
        addressToAccountId(); //Necesito la info del user para pasarla al inventario
    }, []);

    return (
        <>
            <Overlay isVisible={true} />

            <Box
                pos={'absolute'}
                bgColor={'#1F2323'}
                zIndex={99}
                w={'611px'}
                h={'435px'}
                borderRadius={'25px'}
                left={'35%'}>
                <IconButton
                    background={'transparent'}
                    color={'#FFF'}
                    icon={<CloseIcon />}
                    _hover={{ background: 'transparent' }}
                    position="absolute"
                    top={2}
                    right={2}
                />
                {!openIventory && <SelectHandPage arenaInfo={arenaInfo} handleOpenInventory={handleOpenInventory} />}
                {openIventory && <Inventory />}
            </Box>
        </>
    );
};
