import { useEffect } from 'react';

/**
 * @name useKeyClose
 * @description Custom React hook that attaches a keydown event listener to trigger a close function
 * when the Escape key is pressed, only while the component is visible.
 * @param {Function} closeFn - Function to call when Escape is pressed.
 * @param {boolean} isVisible - Determines whether the event listener should be active.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const useKeyClose = (closeFn, isVisible) => {
    useEffect(() => {
        const handleKeyDown = e => e.code === 'Escape' && closeFn();

        if (isVisible) document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, closeFn]);
};
