import { Box, Heading, Stack, useDisclosure, useMediaQuery, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import locations from '../../../../assets/LocationsEnum';
import { errorToast } from '../../../../../../../utils/alerts';
import { sendCardsToBattle } from '../../../../../../../services/Ardor/omnoInterface';
import { checkPin } from '../../../../../../../utils/walletUtils';
import { getSoldiers } from '../../../../../../../services/Battlegrounds/Battlegrounds';
import PinModal from './Components/PinModal';
import TributeDisplay from './Components/TributeDisplay';
import StartBattleButton from './Components/StartBattleButton';
import AttackerCards from './Components/AttackerCards';
import DefenderCards from './Components/DefenderCards';
import StatisticsDisplay from './Components/StatisticsDisplay';
import { isEmptyObject } from '../../../../../../../utils/utils';
import { fetchAssetsWithPricing } from '../../../../Utils/BattlegroundsUtils';

/**
 * @name SelectHandPage
 * @description This component manages the UI and logic for selecting cards ("handBattleCards") to start a battle
 * in the arena. It shows attacker and defender cards, battle costs, statistics, and handles
 * pin validation, battle start logic, and UI modals for user interaction.
 * Features:
 * - Fetches and displays battle costs for the current arena.
 * - Validates user selections and token balances before allowing battle start.
 * - Handles PIN modal and passphrase validation for security.
 * - Calculates defender bonuses based on arena medium and domain.
 * - Responsive UI with Chakra UI, adapting to mobile and viewport height.
 * @param {Object} arenaInfo - Contains arena details such as id, mediumId, domainId, and battleCost.
 * @param {Array} handBattleCards - Array representing the current cards selected by the player.
 * @param {Function} openInventory - Callback to open the card inventory UI.
 * @param {Object} infoAccount - User account info including name and passphrase.
 * @param {Object} defenderInfo - Information about the defender player.
 * @param {Function} deleteCard - Function to delete a card from the hand by index.
 * @param {number} domainBonus - Current domain bonus value for the player.
 * @param {number} mediumBonus - Current medium bonus value for the player.
 * @param {string} domainName - The name of the domain (continent) for display.
 * @param {number|string} omnoGEMsBalance - User's current GEM token balance.
 * @param {number|string} omnoWethBalance - User's current wETH token balance.
 * @param {Function} setShowResults - Setter to toggle display of battle results.
 * @param {Function} setCurrentTime - Setter to update the current timestamp (used after battle start).
 * @param {boolean} isMobile - Flag indicating if the UI is in mobile mode.
 * @param {Array} defenderCards - Array of defender's cards for bonus calculations.
 * @returns {JSX.Element} The full selection and battle start UI, including modals.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const SelectHandPage = ({
    arenaInfo,
    handBattleCards,
    openInventory,
    infoAccount,
    defenderInfo,
    deleteCard,
    domainBonus,
    mediumBonus,
    domainName,
    omnoGEMsBalance,
    omnoWethBalance,
    setShowResults,
    setCurrentTime,
    isMobile,
    defenderCards,
}) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [battleCost, setBattleCost] = useState([]);
    const [medium, setMedium] = useState('');
    const [isValidPin, setIsValidPin] = useState(false);
    const [passphrase, setPassphrase] = useState('');
    const [disableButton, setDisableButton] = useState(false);
    const [preSelectedCard, setPreSelectedCard] = useState(null);
    const [defenderBonus, setDefenderBonus] = useState({ medium: 0, domain: 0 });
    const [isLowHeight] = useMediaQuery('(max-height: 700px)');

    useEffect(() => {
        if (!arenaInfo) return;

        setMedium(getMediumName(arenaInfo?.mediumId));

        const assetMap = arenaInfo?.battleCost?.asset;
        if (!assetMap || Object.keys(assetMap).length === 0) return;

        const fetchCost = async () => {
            try {
                const enriched = await fetchAssetsWithPricing(assetMap);
                setBattleCost(enriched);
            } catch (err) {
                console.error('Error fetching enriched battle cost:', err);
            }
        };

        fetchCost();
    }, [arenaInfo]);

    useEffect(() => {
        const fetchDefenderBonus = async () => {
            try {
                const allSoldiers = await getSoldiers();
                const matchingSoldiers = allSoldiers.soldier.filter(s =>
                    defenderCards.some(card => card.asset === s.asset)
                );

                const domain = matchingSoldiers.filter(s => s.domainId === arenaInfo.domainId).length;
                const medium = matchingSoldiers.filter(s => s.mediumId === arenaInfo.mediumId).length;

                setDefenderBonus({ domain, medium });
            } catch (e) {
                console.error(e);
            }
        };

        fetchDefenderBonus();
    }, [arenaInfo.domainId, arenaInfo.mediumId, defenderCards]);

    const getMediumName = id => {
        return (
            {
                1: 'Terrestrial',
                2: 'Aerial',
                3: 'Aquatic',
            }[id] || 'Unknown'
        );
    };

    const validateBattleStart = () => {
        const hasCard = handBattleCards.some(card => card !== '');
        if (!hasCard) {
            errorToast('Select at least one card to start a battle', toast);
            return false;
        }

        if (isEmptyObject(battleCost)) return true;

        const gemCost = Number(battleCost[0]?.price || 0);
        const wethCost = Number(battleCost[1]?.price || 0);

        if (gemCost > Number(omnoGEMsBalance)) {
            errorToast('Insufficient GEM balance', toast);
            return false;
        }

        if (battleCost.length > 1 && wethCost > Number(omnoWethBalance)) {
            errorToast('Insufficient wETH balance', toast);
            return false;
        }

        return true;
    };

    const handleDeleteCard = (card, index) => {
        const isSame = preSelectedCard?.asset === card.asset;
        if (isSame) {
            deleteCard(index);
            setPreSelectedCard(null);
        } else {
            setPreSelectedCard(card);
        }
    };

    const handleStartBattle = async () => {
        if (!isValidPin || !passphrase) {
            return errorToast('The pin is not correct', toast);
        }

        if (!validateBattleStart()) return;

        setDisableButton(true);
        await sendCardsToBattle({
            cards: handBattleCards,
            passPhrase: passphrase,
            arenaId: arenaInfo.id,
        });

        onClose();
        setCurrentTime(new Date().toISOString());
        setShowResults(true);
    };

    const handleCompletePin = pin => {
        setIsValidPin(false); // reset
        const account = checkPin(infoAccount.name, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const handleStartButtonClick = () => {
        if (validateBattleStart()) onOpen();
    };

    const checkBalance = asset => {
        const balance = asset.name === 'GEM' ? omnoGEMsBalance : omnoWethBalance;
        return Number(asset.price) <= Number(balance) ? '#FFF' : 'red';
    };

    return (
        <>
            <Box display="flex" flexDirection="column" overflowY="scroll" maxH="95%" className="custom-scrollbar">
                <Stack direction="column" mx="auto" mt={isMobile ? 4 : 8}>
                    <Heading
                        color="#FFF"
                        size={isMobile ? 'md' : 'lg'}
                        fontFamily="Chelsea Market, system-ui"
                        fontWeight="300">
                        CONQUER{' '}
                        <span style={{ color: '#D08FB0', textTransform: 'uppercase' }}>
                            {locations[arenaInfo.id - 1]?.name}
                        </span>
                    </Heading>
                </Stack>

                <StatisticsDisplay isMobile={isMobile} medium={medium} domainName={domainName} arenaId={arenaInfo.id} />

                <DefenderCards
                    isMobile={isMobile}
                    defenderInfo={defenderInfo}
                    defenderBonus={defenderBonus}
                    medium={medium}
                    domainName={domainName}
                    defenderCards={defenderCards}
                />

                <AttackerCards
                    handBattleCards={handBattleCards}
                    preSelectedCard={preSelectedCard}
                    handleDeleteCard={handleDeleteCard}
                    openInventory={openInventory}
                    isMobile={isMobile}
                    isLowHeight={isLowHeight}
                    mediumBonus={mediumBonus}
                    medium={medium}
                    domainBonus={domainBonus}
                    domainName={domainName}
                />

                <Stack direction="row" w="50%" mx="auto" mt={isMobile ? 3 : 6}>
                    <StartBattleButton handleStartButtonClick={handleStartButtonClick} isMobile={isMobile} />
                    <TributeDisplay isMobile={isMobile} battleCost={battleCost} checkBalance={checkBalance} />
                </Stack>
            </Box>

            <PinModal
                isOpen={isOpen}
                onClose={onClose}
                handleCompletePin={handleCompletePin}
                isValidPin={isValidPin}
                handleStartBattle={handleStartBattle}
                disableButton={disableButton}
            />
        </>
    );
};
