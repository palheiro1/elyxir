export const handleNewNotification = (tx, isIncoming, toast) => {
    const id = tx.fullHash;
    if (toast.isActive(id)) return;

    toast({
        title: isIncoming ? 'New incoming transaction' : 'New outgoing transaction',
        description: isIncoming
            ? 'New incoming transaction waiting for confirmation'
            : 'New outgoing transaction waiting for confirmation',
        status: 'info',
        duration: 25000,
        isClosable: true,
        position: 'bottom-right',
    });
};

export const handleConfirmateNotification = (tx, isIncoming, toast) => {
    const id = tx.fullHash;
    if (toast.isActive(id)) return;

    toast({
        title: 'Transaction confirmed',
        description: isIncoming ? 'New incoming transaction confirmed' : 'New outgoing transaction confirmed',
        status: 'success',
        duration: 25000,
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

export const backupToast = toast => {
    const id = 'backup-toast';
    if (toast.isActive(id)) return;

    toast({
        id,
        title: 'No backup of your passphrase!',
        description:
            "You don't have a backup of your passphrase. We recommend you to make a backup of your passphrase to avoid losing your account. Please, go to the account page and click on the 'Backup passphrase' button.",
        status: 'warning',
        duration: 15000,
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
    const id = 'copy-toast';
    if (toast.isActive(id)) return;

    toast({
        id,
        title: 'Copied to Clipboard',
        description: `${text} has been copied to the clipboard.`,
        status: 'success',
        duration: 9000,
        isClosable: true,
    });
};
