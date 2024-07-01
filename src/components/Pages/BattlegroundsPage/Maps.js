import React, { useEffect, useState } from 'react';
import './BattlegroundMap.css';
import { Box } from '@chakra-ui/react';
import { MapImage } from './assets/MapImage';
import { MapPoint } from './Components/MapPoint';
import locations from './assets/LocationsEnum';
import { getArenas } from '../../../services/Battlegrounds/Battlegrounds';

export const Maps = ({ handleSelectArena, infoAccount, cards, handleStartBattle }) => {
    const [arenasInfo, setArenasInfo] = useState();
    const [selectedArena, setSelectedArena] = useState();
    useEffect(() => {
        const getData = async () => {
            await getArenas().then(res => {
                setArenasInfo(res);
            });
        };
        getData();
    }, []);

    const handleClick = id => {
        handleSelectArena(arenasInfo.arena[id - 1]);
        setSelectedArena(id);
    };
    return (
        arenasInfo && (
            <Box className="containerMap" zIndex={5}>
                <svg
                    width="979"
                    height="543"
                    viewBox="0 0 979 543"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xlink="http://www.w3.org/1999/xlink">
                    <g clipPath="url(#clip0_3079_4498)">
                        <rect width="979" height="542.802" fill="url(#pattern0)" />
                        {locations.map(location => (
                            <MapPoint
                                key={location.id}
                                name={location.name}
                                x={location.x}
                                y={location.y}
                                id={location.id}
                                handleClick={handleClick}
                                arenaInfo={arenasInfo.arena[location.id - 1]}
                                selectedArena={selectedArena}
                                cards={cards}
                                handleStartBattle={handleStartBattle}
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
