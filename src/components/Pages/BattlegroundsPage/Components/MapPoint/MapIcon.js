import { PopoverTrigger } from '@chakra-ui/react';
import { getMapPointIcon } from '../../Utils/BattlegroundsUtils';

/**
 * @name MapIcon
 * @description Renders an SVG map icon for battleground arenas with interactive popover trigger.
 * Includes drop shadow and halo effect if the arena belongs to the user.
 * @param {object} props - Component properties
 * @param {function} props.handlePopoverClick - Callback function triggered on icon click or keyboard activation.
 * @param {boolean} props.myArena - Whether the arena belongs to the current user, adds halo effect if true.
 * @param {object} props.arena - Arena data object containing coordinates, rarity, and medium.
 * @param {number} props.arena.x - X coordinate of the icon on the map.
 * @param {number} props.arena.y - Y coordinate of the icon on the map.
 * @param {number|string} props.arena.rarity - Rarity level used for icon selection.
 * @param {number|string} props.arena.mediumId - Medium type used for icon selection.
 * @returns {JSX.Element} The rendered SVG map icon with popover trigger.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const MapIcon = ({ handlePopoverClick, myArena, arena }) => {
    const { x, y, rarity, mediumId } = arena;
    const iconSrc = getMapPointIcon(rarity, mediumId);

    const iconSize = 20;

    return (
        <PopoverTrigger>
            <g>
                <defs>
                    <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0, 0, 0, 0.3)" />
                    </filter>
                    <radialGradient id="haloGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="white" stopOpacity="1" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {myArena && <circle cx={x} cy={y} r={iconSize / 2 + 12} fill="url(#haloGradient)" />}

                <image
                    href={iconSrc}
                    x={x - iconSize / 2}
                    y={y - iconSize / 2}
                    width={iconSize}
                    height={iconSize}
                    filter="url(#dropShadow)"
                    onClick={handlePopoverClick}
                    style={{ cursor: 'pointer' }}
                />
            </g>
        </PopoverTrigger>
    );
};

export default MapIcon;
