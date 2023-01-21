export const handleNewNotification = (tx, toast) => {
    const id = tx.fullHash;
    if (toast.isActive(id)) return;

    toast({
        title: 'Info',
        description: "New transation waiting for confirmation",
        status: 'info',
        duration: 15000,
        isClosable: true,
        position: 'bottom-right',
    });
};

export const handleConfirmateNotification = (tx, toast) => {
    const id = tx.fullHash;
    if (toast.isActive(id)) return;

    toast({
        title: 'Success',
        description: "New transaction has been confirmed",
        status: 'success',
        duration: 15000,
        isClosable: true,
        position: 'bottom-right',
    });
};

/**
 * @param {string} text - Text to display in the toast
 * @param {function} toast - Toast function
 * @returns {void}
 * @description This function is used to display a success toast
 */
export const okToast = (text, toast) => {
    const id = text;
    if (toast.isActive(id)) return;

    toast({
        title: 'Success',
        description: text,
        status: 'success',
        duration: 9000,
        isClosable: true,
    });
};

/**
 * @param {string} text - Text to display in the toast
 * @param {function} toast - Toast function
 * @returns {void}
 * @description This function is used to display an error toast
 */
export const errorToast = (text, toast) => {
    const id = text;
    if (toast.isActive(id)) return;

    toast({
        title: 'Error',
        description: text,
        status: 'error',
        duration: 9000,
        isClosable: true,
    });
};

/**
 * @param {string} text - Text to display in the toast
 * @param {function} toast - Toast function
 * @returns {void}
 * @description This function is used to display a warning toast
 */
export const warningToast = (text, toast) => {
    const id = text;
    if (toast.isActive(id)) return;

    toast({
        title: 'Warning',
        description: text,
        status: 'warning',
        duration: 9000,
        isClosable: true,
    });
};

/**
 * @param {string} text - Text to display in the toast
 * @param {function} toast - Toast function
 * @returns {void}
 * @description This function is used to display an info toast
 */
export const infoToast = (text, toast) => {
    const id = text;
    if (toast.isActive(id)) return;

    toast({
        title: 'Info',
        description: text,
        status: 'info',
        duration: 9000,
        isClosable: true,
    });
};

/**
 * @param {string} text - Text to display in the toast
 * @param {function} toast - Toast function
 * @returns {void}
 * @description This function is used to display a toast with a copy to clipboard button
 */
export const copyToast = (text, toast) => {
    const id = text;
    if (toast.isActive(id)) return;

    toast({
        id,
        title: 'Copied to clipboard!',
        description: text + ' copied to clipboard',
        status: 'success',
        duration: 9000,
        isClosable: true,
    });
};
