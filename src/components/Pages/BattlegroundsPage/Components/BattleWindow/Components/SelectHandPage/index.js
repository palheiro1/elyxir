import { Box, Heading, Stack, useDisclosure, useMediaQuery, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import locations from '../../../../assets/LocationsEnum';
import { isEmptyObject } from '../../../../Utils/BattlegroundsUtils';
import { getAsset } from '../../../../../../../services/Ardor/ardorInterface';
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
    const [battleCost, setBattleCost] = useState({});
    const [medium, setMedium] = useState();
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');
    const [disableButton, setDisableButton] = useState(false);
    const [preSelectedCard, setPreSelectedCard] = useState(null);
    const [defenderBonus, setDefenderBonus] = useState({
        medium: 0,
        domain: 0,
    });

    useEffect(() => {
        const getBattleCost = async () => {
            const assets = Object.entries(arenaInfo.battleCost.asset);

            const results = await Promise.all(
                assets.map(async ([asset, price]) => {
                    const assetDetails = await getAsset(asset);
                    return { ...assetDetails, price };
                })
            );

            setBattleCost(results);
        };

        if (arenaInfo) {
            if (!isEmptyObject(arenaInfo.battleCost)) {
                getBattleCost();
            }
        }

        if (arenaInfo) {
            (() => {
                switch (arenaInfo.mediumId) {
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
            })();
        }
    }, [arenaInfo]);

    const validateBattleStart = () => {
        let allEmpty = true;
        for (let i = 0; i < handBattleCards.length; i++) {
            if (handBattleCards[i] !== '') {
                allEmpty = false;
                break;
            }
        }

        if (allEmpty) {
            errorToast('Select at least one card to start a battle', toast);
            return false;
        }

        if (!isEmptyObject(battleCost)) {
            const gemBalance = parseInt(omnoGEMsBalance);
            const wethBalance = parseInt(omnoWethBalance);
            const battleCostGems = parseInt(battleCost[0].price);
            const battleCostWeth = battleCost.length > 1 ? parseInt(battleCost[1].price) : 0;

            if (battleCostGems > gemBalance) {
                errorToast('Insuficient GEM balance', toast);
                return false;
            }

            if (battleCost.length > 1 && battleCostWeth > wethBalance) {
                errorToast('Insuficient wETH balance', toast);
                return false;
            }
        }

        return true;
    };

    const handleStartBattle = async () => {
        if (!isValidPin || !passphrase) return errorToast('The pin is not correct', toast);

        const valid = validateBattleStart();
        if (!valid) return;

        setDisableButton(true);
        await sendCardsToBattle({ cards: handBattleCards, passPhrase: passphrase, arenaId: arenaInfo.id });
        onClose();
        setCurrentTime(new Date().toISOString());
        setShowResults(true);
    };

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const { name } = infoAccount;
        const account = checkPin(name, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const [isLowHeight] = useMediaQuery('(max-height: 700px)');

    const handleDeleteCard = (card, index) => {
        if (preSelectedCard && preSelectedCard.asset === card.asset) {
            deleteCard(index);
            setPreSelectedCard(null);
        } else {
            setPreSelectedCard(card);
        }
    };

    const handleStartButtonClick = () => {
        const valid = validateBattleStart();
        valid && onOpen();
    };

    useEffect(() => {
        const getDefenderBonus = async () => {
            const defenderSoldiers = await getSoldiers()
                .then(res => res.soldier)
                .then(soldiers => soldiers.filter(soldier => defenderCards.some(card => card.asset === soldier.asset)))
                .catch(error => console.error(error));
            let domainBonus = 0;
            let mediumBonus = 0;
            defenderSoldiers.forEach(soldier => {
                if (soldier.mediumId === arenaInfo.mediumId) mediumBonus++;
                if (soldier.domainId === arenaInfo.domainId) domainBonus++;
            });
            setDefenderBonus({
                medium: mediumBonus,
                domain: domainBonus,
            });
        };
        getDefenderBonus();
    }, [arenaInfo.domainId, arenaInfo.mediumId, defenderCards]);

    const checkBalance = asset => {
        if (asset.name === 'GEM') {
            if (Number(asset.price) < Number(omnoGEMsBalance)) return '#FFF';
            return 'red';
        }
        if (asset.name === 'wETH') {
            if (Number(asset.price) < Number(omnoWethBalance)) return '#FFF';
            return 'red';
        }
    };
    return (
        <>
            <Box display={'flex'} flexDir={'column'} overflowY={'scroll'} maxH={'95%'} className="custom-scrollbar">
                <Stack direction={'column'} mx={'auto'} mt={isMobile ? 4 : 8}>
                    <Heading
                        color={'#FFF'}
                        size={isMobile ? 'md' : 'lg'}
                        fontFamily={'Chelsea Market, system-ui'}
                        fontWeight={'300'}>
                        CONQUER{' '}
                        <span style={{ color: '#D08FB0', textTransform: 'uppercase' }}>
                            {locations[arenaInfo.id - 1].name}
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

                <Stack direction={'row'} w={'50%'} mx={'auto'} mt={isMobile ? 3 : 6}>
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
