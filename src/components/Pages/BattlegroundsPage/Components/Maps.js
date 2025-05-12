import React, { useEffect, useMemo, useState } from 'react';
import '../BattlegroundMap.css';
import { MapImage } from '../assets/MapImage';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArenasInfo } from '../../../../redux/reducers/ArenasReducer';
import MapPoint from './MapPoint';

export const Maps = ({ handleSelectArena, infoAccount, cards, handleStartBattle, w, filters, isMobile }) => {
    const [selectedArena, setSelectedArena] = useState();
    const [openPopoverId, setOpenPopoverId] = useState(null);
    const { arenasInfo } = useSelector(state => state.arenas);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchArenasInfo());
    }, [dispatch]);

    const handleClick = id => {
        handleSelectArena(arenasInfo[id - 1]);
        setSelectedArena(id);
    };

    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const scale = useMemo(() => {
        const minWidth = 480;
        const maxWidth = 1440;
        const minScale = 0.7;
        const maxScale = 1.1;

        const clampedWidth = Math.min(Math.max(windowWidth, minWidth), maxWidth);
        const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth);
        return minScale + (maxScale - minScale) * ratio;
    }, [windowWidth]);

    return (
        arenasInfo && (
            <svg
                width={w}
                height="543"
                viewBox="0 0 973 543"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                }}
                xlink="http://www.w3.org/1999/xlink">
                <g clipPath="url(#clip0_3079_4498)">
                    <rect width="979" height="542.802" fill="url(#pattern0)" />
                    {arenasInfo
                        .filter(arena => filters.rarity === -1 || arena.level === filters.rarity)
                        .filter(arena => filters.element === -1 || arena.mediumId === filters.element)
                        .map(arena => (
                            <MapPoint
                                key={arena.id}
                                arena={arena}
                                handleClick={handleClick}
                                selectedArena={selectedArena}
                                cards={cards}
                                handleStartBattle={handleStartBattle}
                                infoAccount={infoAccount}
                                openPopoverId={openPopoverId}
                                setOpenPopoverId={setOpenPopoverId}
                            />
                        ))}
                </g>
                <defs>
                    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use
                            href="#image0_3079_4498"
                            transform="matrix(0.000608651 0 0 0.00109776 -0.0869131 -0.122523)"
                        />
                    </pattern>
                    <MapImage />
                </defs>
            </svg>
        )
    );
};
