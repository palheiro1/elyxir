import { useEffect, useState } from 'react';
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

    useEffect(() => {
        let interval;

        const calculate = async () => {
            const targetBlock = await getTargetBlockFn();
            const getDelta = () => (targetBlock - prev_height) * BLOCKTIME;

            const update = () => {
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

        return () => clearInterval(interval);
    }, [prev_height, getTargetBlockFn]);

    return timeLeft;
};
