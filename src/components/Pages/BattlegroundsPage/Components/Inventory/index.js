import { Box, IconButton, Select, Stack, Text, useMediaQuery } from '@chakra-ui/react';
import { useState } from 'react';
import { Overlay } from '../../../../ui/Overlay';
import { CloseIcon } from '@chakra-ui/icons';
import OmnoPage from './OmnoPage';
import ArdorPage from './ArdorPage';

const Inventory = ({ infoAccount, cards, handleCloseInventory, isMobile }) => {
    const [selectedOption, setSelectedOption] = useState('battlegrounds');

    const handleSelectChange = event => {
        setSelectedOption(event.target.value);
    };

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
                <Stack
                    direction={'column'}
                    fontFamily={'Chelsea Market, System'}
                    position="absolute"
                    top={isMobile ? 2 : 8}
                    left={8}>
                    <Text fontSize={'xs'} mx={'auto'}>
                        SEND TO
                    </Text>
                    <Select
                        w={'fit-content'}
                        bg={'#FFF'}
                        color={'#000'}
                        fontWeight={100}
                        value={selectedOption}
                        onChange={handleSelectChange}>
                        <option value="battlegrounds" style={{ backgroundColor: '#FFF' }}>
                            Army
                        </option>
                        <option value="ardor" style={{ backgroundColor: '#FFF' }}>
                            Inventory
                        </option>
                    </Select>
                </Stack>
                {selectedOption === 'battlegrounds' && (
                    <OmnoPage infoAccount={infoAccount} cards={cards} gridColumns={getColumns} isMobile={isMobile} />
                )}
                {selectedOption === 'ardor' && (
                    <ArdorPage infoAccount={infoAccount} cards={cards} gridColumns={getColumns} isMobile={isMobile} />
                )}
            </Box>
        </>
    );
};

export default Inventory;
