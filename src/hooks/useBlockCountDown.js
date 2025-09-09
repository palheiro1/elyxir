import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { BLOCKTIME } from '../data/CONSTANTS';

/**
 * @name useBlockCountdown
 * @description Custom hook that calculates remaining time (in days/hours/minutes/seconds) based on target block.
 * @param {Function} getTargetBlockFn - Async function that returns the target reset block.
 * @returns {{ days: number, hours: number, minutes: number, seconds: number }} Countdown time object.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const useBlockCountdown = getTargetBlockFn => {
    const { prev_height } = useSelector(state => state.blockchain);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Use a ref to keep getTargetBlockFn stable
    const getTargetBlockFnRef = useRef(getTargetBlockFn);
    useEffect(() => { getTargetBlockFnRef.current = getTargetBlockFn; }, [getTargetBlockFn]);

    useEffect(() => {
        let interval;
        let cancelled = false;

        const calculate = async () => {
            const targetBlock = await getTargetBlockFnRef.current();
            const getDelta = () => (targetBlock - prev_height) * BLOCKTIME;

            const update = () => {
                if (cancelled) return;
                const delta = Math.max(0, getDelta());
                const days = Math.floor(delta / (24 * 3600));
                const hours = Math.floor((delta % (24 * 3600)) / 3600);
                const minutes = Math.floor((delta % 3600) / 60);
                const seconds = Math.floor(delta % 60);
                setTimeLeft({ days, hours, minutes, seconds });
            };

            update();
            interval = setInterval(update, 1000);
        };

        if (prev_height) calculate();

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [prev_height]);

    return timeLeft;
};
