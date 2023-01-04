/**
 * @param {string} text - Text to display in the toast
 * @param {function} toast - Toast function
 * @returns {void}
 * @description This function is used to display a success toast
 */
export const okToast = (text, toast) => {
    toast({
        title: 'Success',
        description: text,
        status: 'success',
        duration: 9000,
        isClosable: true,
    })
}

/**
 * @param {string} text - Text to display in the toast
 * @param {function} toast - Toast function
 * @returns {void}
 * @description This function is used to display an error toast
 */
export const errorToast = (text, toast) => {
    toast({
        title: 'Error',
        description: text,
        status: 'error',
        duration: 9000,
        isClosable: true,
    })
}

/**
 * @param {string} text - Text to display in the toast
 * @param {function} toast - Toast function
 * @returns {void}
 * @description This function is used to display a warning toast
 */
export const warningToast = (text, toast) => {
    toast({
        title: 'Warning',
        description: text,
        status: 'warning',
        duration: 9000,
        isClosable: true,
    })
}

/**
 * @param {string} text - Text to display in the toast
 * @param {function} toast - Toast function
 * @returns {void}
 * @description This function is used to display an info toast
 */
export const infoToast = (text, toast) => {
    toast({
        title: 'Info',
        description: text,
        status: 'info',
        duration: 9000,
        isClosable: true,
    })
}

/**
 * @param {string} text - Text to display in the toast
 * @param {function} toast - Toast function
 * @returns {void}
 * @description This function is used to display a toast with a copy to clipboard button
 */
export const copyToast = (text, toast) => {
    toast({
        title: 'Copied to clipboard!',
        description: text + ' copied to clipboard',
        status: 'success',
        duration: 9000,
        isClosable: true,
    })
}