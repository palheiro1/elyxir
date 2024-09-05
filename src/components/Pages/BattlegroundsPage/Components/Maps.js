import React, { useEffect, useState } from 'react';
import '../BattlegroundMap.css';
import { Box } from '@chakra-ui/react';
import { MapImage } from '../assets/MapImage';
import { MapPoint } from './MapPoint';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArenasInfo } from '../../../../redux/reducers/ArenasReducer';

export const Maps = ({ handleSelectArena, infoAccount, cards, handleStartBattle, w, filters }) => {
    const [selectedArena, setSelectedArena] = useState();
    const { arenasInfo } = useSelector(state => state.arenas);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchArenasInfo());
    }, [dispatch]);

    const handleClick = id => {
        handleSelectArena(arenasInfo[id - 1]);
        setSelectedArena(id);
    };
    return (
        arenasInfo && (
            <Box className="containerMap" zIndex={0}>
                <svg
                    width={w}
                    height="543"
                    viewBox="0 0 973 543"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xlink="http://www.w3.org/1999/xlink">
                    <g clipPath="url(#clip0_3079_4498)">
                        <rect width="979" height="542.802" fill="url(#pattern0)" />
                        {arenasInfo
                            .filter(arena => filters.rarity === '' || arena.level === Number(filters.rarity))
                            .filter(arena => filters.element === '' || arena.mediumId === Number(filters.element))
                            .map(arena => (
                                <MapPoint
                                    key={arena.id}
                                    arena={arena}
                                    handleClick={handleClick}
                                    selectedArena={selectedArena}
                                    cards={cards}
                                    handleStartBattle={handleStartBattle}
                                    infoAccount={infoAccount}
                                />
                            ))}
                        {/* Max X: 970 Max Y: 530*/}
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
            </Box>
        )
    );
};
