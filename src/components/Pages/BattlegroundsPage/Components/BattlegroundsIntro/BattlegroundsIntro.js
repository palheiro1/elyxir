import { Box, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { PageOne } from './PageOne';
import { Overlay } from './Overlay';
import { PageTwo } from './PageTwo';

export const BattlegroundsIntro = ({ visible, page, handleClose, handleNext }) => {
    return (
        <>
            <Overlay handleClose={handleClose} isVisible={visible} />
            <Box
                visibility={visible ? 'visible' : 'hidden'}
                backgroundColor={'#1F2323'}
                borderRadius={'30px'}
                w={'60%'}
                h={'60%'}
                pos={'fixed'}
                top={'50%'}
                left={'50%'}
                transform={'translate(-50%, -50%)'}
                zIndex={11}>
                <IconButton
                    background={'transparent'}
                    color={'#FFF'}
                    icon={<CloseIcon />}
                    _hover={{ background: 'transparent' }}
                    onClick={handleClose}
                    position="absolute"
                    top={2}
                    right={2}
                />

                {page === 1 && <PageOne handleNext={handleNext} />}
                {page === 2 && <PageTwo handleClose={handleClose} />}
            </Box>
        </>
    );
};
