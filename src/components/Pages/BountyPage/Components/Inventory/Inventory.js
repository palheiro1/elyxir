import { Box, IconButton, useMediaQuery } from '@chakra-ui/react';
import React from 'react';
import { CloseIcon } from '@chakra-ui/icons';
import { Overlay } from '../../../BattlegroundsPage/Components/BattlegroundsIntro/Overlay';
import InventoryPage from './InventoryPage';

const Inventory = ({ infoAccount, cards, handleCloseInventory, isMobile }) => {
    const closeInvetory = () => {
        handleCloseInventory();
    };

    const [isLittleScreen] = useMediaQuery('(min-width: 1200px) and (max-width: 1399px)');
    const [isMediumScreen] = useMediaQuery('(min-width: 1400px) and (max-width: 1550px)');

    const getColumns = () => {
        if (isMobile) return 1;
        if (isMediumScreen) return 4;
        if (isLittleScreen) return 3;
        return 5;
    };

    return (
        <>
            <Overlay isVisible={true} handleClose={handleCloseInventory} />
            <Box
                pos={'fixed'}
                top={'50%'}
                left={'50%'}
                transform={'translate(-50%, -50%)'}
                bgColor={'#1F2323'}
                zIndex={99}
                w={isMobile ? '90%' : '98%'}
                p={4}
                display={'flex'}
                flexDir={'column'}
                h={isMobile ? '85%' : '90%'}
                borderRadius={'25px'}>
                <IconButton
                    background={'transparent'}
                    color={'#FFF'}
                    icon={<CloseIcon />}
                    _hover={{ background: 'transparent' }}
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={() => closeInvetory()}
                />

                <InventoryPage infoAccount={infoAccount} cards={cards} gridColumns={getColumns} isMobile={isMobile} />
            </Box>
        </>
    );
};

export default Inventory;
