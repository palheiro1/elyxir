import { Box } from '@chakra-ui/react';

export const Overlay = ({ isVisible, handleClose }) => {
    return (
        isVisible && (
            <Box
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 10,
                }}
                onClick={handleClose}
            />
        )
    );
};
