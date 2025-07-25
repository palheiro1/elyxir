import { memo, useCallback, useEffect, useState } from 'react';
import { Popover, useDisclosure } from '@chakra-ui/react';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import { useDispatch } from 'react-redux';
import MapIcon from './MapIcon';
import { addressToAccountId, getAccount } from '../../../../../services/Ardor/ardorInterface';
import { fetchSoldiers } from '../../../../../redux/reducers/SoldiersReducer';
import MapPopover from './MapPopover';

/**
 * @name MapPoint
 * @description Interactive SVG point rendered on a battle map. Represents an arena with a defender that the user can challenge. Displays detailed info in a popover, including defender’s cards and metadata.
 * @param {Function} handleClick - Function triggered when the user selects this arena.
 * @param {Object} arena - Object representing the arena (id, coordinates, name, defender info, rarity, etc).
 * @param {Number} selectedArena - ID of the currently selected arena.
 * @param {Array} cards - Full list of soldier cards available for matching against the defender.
 * @param {Function} handleStartBattle - Function triggered when the battle is started.
 * @param {Object} infoAccount - The current user's account info (includes .accountRs).
 * @param {String|Number} openPopoverId - ID of the currently open popover on the map.
 * @param {Function} setOpenPopoverId - Setter to change which popover is open.
 * @param {Boolean} isMobile - Whether the current device is mobile-sized (affects layout).
 * @returns {JSX.Element|null} A map point rendered as a clickable SVG circle with a Chakra Popover that shows arena and defender details.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const MapPoint = memo(
    ({ handleClick, arena, cards, handleStartBattle, infoAccount, openPopoverId, setOpenPopoverId }) => {
        const dispatch = useDispatch();

        const [defenderInfo, setDefenderInfo] = useState(null);
        const [defenderCards, setDefenderCards] = useState(null);
        const [myArena, setMyArena] = useState(false);
        const [medium, setMedium] = useState('Unknown');

        const { isOpen, onClose, onOpen } = useDisclosure();

        const { id, name } = arena;

        useEffect(() => {
            const getDefenderInfo = async () => {
                const accountId = addressToAccountId(infoAccount.accountRs);
                const res = await getAccount(arena.defender.account);
                setDefenderInfo(res);
                const defenderAssets = new Set(arena.defender.asset);
                const matchingObjects = cards.filter(obj => defenderAssets.has(obj.asset));
                setDefenderCards(matchingObjects);
                if (arena.defender.account === accountId) {
                    setMyArena(true);
                }
            };
            arena.defender?.account && infoAccount.accountRs && getDefenderInfo();
        }, [arena.defender.account, arena.defender.asset, cards, infoAccount.accountRs]);

        useEffect(() => {
            if (openPopoverId === id) {
                onOpen();
            } else {
                onClose();
            }
        }, [openPopoverId, id, onOpen, onClose]);

        const handlePopoverClick = () => {
            if (isOpen) {
                onClose();
                setOpenPopoverId(null);
            } else {
                setOpenPopoverId(id);
                onOpen();
            }
        };

        const handleClose = useCallback(() => {
            setOpenPopoverId(null);
            onClose();
        }, [onClose, setOpenPopoverId]);

        const clickButton = useCallback(() => {
            handleClose();
            handleClick(id);
            handleStartBattle();
        }, [handleClick, handleClose, handleStartBattle, id]);

        useEffect(() => {
            dispatch(fetchSoldiers());
        }, [dispatch]);

        useEffect(() => {
            switch (arena.mediumId) {
                case 1:
                    setMedium('Terrestrial');
                    break;
                case 2:
                    setMedium('Aerial');
                    break;
                case 3:
                    setMedium('Aquatic');
                    break;
                default:
                    setMedium('Unknown');
            }
        }, [arena.mediumId]);

        if (id === 68) return null; // Fail arena in omno
        return (
            arena &&
            defenderInfo && (
                <>
                    <Popover
                        isOpen={isOpen}
                        onClose={handleClose}
                        closeOnBlur={true}
                        motionPreset="scale"
                        placement="right">
                        <MapIcon handlePopoverClick={handlePopoverClick} myArena={myArena} arena={arena} />
                        {isOpen && (
                            <MapPopover
                                arena={arena}
                                name={name}
                                medium={medium}
                                defenderInfo={defenderInfo}
                                handleClose={handleClose}
                                defenderCards={defenderCards}
                                clickButton={clickButton}
                                myArena={myArena}
                            />
                        )}
                    </Popover>
                </>
            )
        );
    }
);

export default MapPoint;
