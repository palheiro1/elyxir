import { IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import { Overlay } from './Overlay';

/**
 * @name Modal
 * @description
 * Reusable tooltip/modal component with customizable size, animation, and close control.
 * @param {Object} props - Component props.
 * @param {boolean} props.isVisible - Whether the tooltip/modal is shown.
 * @param {function} props.onClose - Function to close the modal.
 * @param {React.ReactNode} props.children - Content to render inside the modal.
 * @param {string|number} props.width - Width of the modal (e.g., '70%' or '500px').
 * @param {string|number} props.height - Height of the modal (e.g., '90%' or '600px').
 * @param {boolean} [props.showCloseIcon=true] - Whether to show the close icon.
 * @param {string} [props.bgColor='#1F2323'] - Background color.
 * @returns {JSX.Element} The rendered modal component.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const Modal = ({ isVisible, onClose, children, width, height, showCloseIcon = true, bgColor = '#1F2323', ...rest }) => {
    return (
        <>
            <Overlay isVisible={isVisible} handleClose={onClose} />
            <Box
                key="modal"
                pos="fixed"
                bgColor={bgColor}
                zIndex={99}
                w={width}
                h={height}
                borderRadius="25px"
                overflowY="auto"
                className="custom-scrollbar"
                top="50%"
                left="50%"
                transform={'translate(-50%, -50%)'}
                boxShadow="0px 5px 20px 5px rgba(255,255,255, 0.25)"
                {...rest}>
                {showCloseIcon && (
                    <IconButton
                        background="transparent"
                        color="#FFF"
                        icon={<CloseIcon />}
                        _hover={{ background: 'transparent' }}
                        position="absolute"
                        top={2}
                        right={2}
                        zIndex={999}
                        onClick={onClose}
                    />
                )}
                {children}
            </Box>
        </>
    );
};
export default Modal;
