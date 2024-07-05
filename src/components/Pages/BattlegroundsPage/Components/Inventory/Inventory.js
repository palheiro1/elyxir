import { Box, IconButton, Select } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import { CloseIcon } from '@chakra-ui/icons';
import '@fontsource/chelsea-market';
import '../../BattlegroundMap.css';
import OmnoPage from './OmnoPage';
import ArdorPage from './ArdorPage';
const Inventory = ({ infoAccount, cards, handleCloseInventory, filteredCards }) => {
    const [selectedOption, setSelectedOption] = useState('battlegrounds');

    const handleSelectChange = event => {
        setSelectedOption(event.target.value);
    };

    const closeInvetory = () => {
        handleCloseInventory();
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
                w={'98%'}
                p={4}
                display={'flex'}
                flexDir={'column'}
                h={'90%'}
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
                <Select
                    position="absolute"
                    top={8}
                    left={8}
                    w={'fit-content'}
                    bg={'#FFF'}
                    color={'#000'}
                    fontFamily={'Chelsea Market, System'}
                    fontWeight={100}
                    value={selectedOption}
                    onChange={handleSelectChange}>
                    <option value="battlegrounds" style={{ backgroundColor: '#FFF' }}>
                        Battlegrounds
                    </option>
                    <option value="ardor" style={{ backgroundColor: '#FFF' }}>
                        Inventory
                    </option>
                </Select>
                {selectedOption === 'battlegrounds' && (
                    <OmnoPage filteredCards={filteredCards} infoAccount={infoAccount} cards={cards} />
                )}
                {selectedOption === 'ardor' && (
                    <ArdorPage filteredCards={filteredCards} infoAccount={infoAccount} cards={cards} />
                )}
            </Box>
        </>
    );
};

export default Inventory;
