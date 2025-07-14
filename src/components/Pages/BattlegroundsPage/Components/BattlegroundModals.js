import BattleRecord from './BattleRecord';
import { BattleWindow } from './BattleWindow';
import Earnings from './EarnigsPage/Earnings';
import Inventory from './Inventory';
import Leaderboards from './Leaderboards';
import AdvertModal from './Modals/AdvertModal';
import ChangeName from './Modals/ChangeName';
import NewPlayersModal from './Modals/NewPlayersModal';
import SendGEMsToOmno from './Modals/SendGEMsToOmno';
import SendWethToOmno from './Modals/SendWethToOmno';
import QuickStartModal from './QuickStart';

/**
 * @name BattlegroundModals
 * @description Component that conditionally renders all the modal windows used within the Battlegrounds section of the platform. These include inventory, battle, leaderboards, records, earnings, quick start guide, and token transfer modals.
 * @param {Object} props - Props object.
 * @param {Object} props.infoAccount - Contains user info like `accountRs`, balances, etc.
 * @param {Object} props.modals - Flags that determine which modals are open.
 * @param {string} props.selectedArena - The currently selected arena ID for battles.
 * @param {Array} props.cards - Full list of the user's cards.
 * @param {Array} props.filteredCards - Filtered cards based on current filters.
 * @param {number} props.omnoGEMsBalance - Current GEM balance in Omno.
 * @param {number} props.omnoWethBalance - Current WETH balance in Omno.
 * @param {boolean} props.isMobile - Flag indicating if the viewport is mobile.
 * @param {boolean} props.isMediumScreen - Flag indicating if the viewport is medium-sized.
 * @param {boolean} props.isOpenGems - Chakra state for the GEM modal.
 * @param {boolean} props.isOpenWeth - Chakra state for the WETH modal.
 * @param {string|null} props.gemsModalMode - Operation mode for GEM modal (e.g., 'deposit', 'withdraw').
 * @param {string|null} props.wethModalMode - Operation mode for WETH modal.
 * @param {Function} props.handleCloseModal - Closes a modal by name.
 * @param {Function} props.handleOpenModal - Opens a modal by name.
 * @param {Function} props.onCloseGems - Closes the GEM modal using Chakra.
 * @param {Function} props.onCloseWeth - Closes the WETH modal using Chakra.
 * @returns {JSX.Element} The rendered modals, based on the currently active modal flags.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattlegroundModals = ({
    infoAccount,
    modals,
    selectedArena,
    cards,
    filteredCards,
    omnoGEMsBalance,
    omnoWethBalance,
    isMobile,
    isMediumScreen,
    isOpenGems,
    isOpenWeth,
    gemsModalMode,
    wethModalMode,
    handleCloseModal,
    handleOpenModal,
    onCloseGems,
    onCloseWeth,
}) => {
    return (
        <>
            <SendGEMsToOmno
                gemsModalMode={gemsModalMode}
                infoAccount={infoAccount}
                isOpen={isOpenGems}
                onClose={onCloseGems}
            />
            <SendWethToOmno
                wethModalMode={wethModalMode}
                infoAccount={infoAccount}
                isOpen={isOpenWeth}
                onClose={onCloseWeth}
            />
            {modals.name && <ChangeName isOpen onClose={() => handleCloseModal('name')} infoAccount={infoAccount} />}
            {modals.battle && (
                <BattleWindow
                    arenaInfo={selectedArena}
                    handleCloseBattle={handleCloseModal}
                    infoAccount={infoAccount}
                    cards={cards}
                    filteredCards={filteredCards}
                    omnoGEMsBalance={omnoGEMsBalance}
                    omnoWethBalance={omnoWethBalance}
                    isMobile={isMobile}
                />
            )}
            {modals.inventory && (
                <Inventory
                    infoAccount={infoAccount}
                    cards={cards}
                    handleCloseInventory={() => handleCloseModal('inventory')}
                    isMobile={isMobile}
                />
            )}
            {modals.battleRecord && (
                <BattleRecord
                    handleClose={() => handleCloseModal('battleRecord')}
                    infoAccount={infoAccount}
                    cards={cards}
                    isMobile={isMobile}
                />
            )}
            {modals.earnings && (
                <Earnings
                    isMobile={isMobile}
                    closeEarnigs={() => handleCloseModal('earnings')}
                    infoAccount={infoAccount}
                    cards={cards}
                />
            )}
            {modals.leaderboards && (
                <Leaderboards handleClose={() => handleCloseModal('leaderboards')} isMobile={isMobile} />
            )}
            {modals.quickStart && (
                <QuickStartModal
                    handleClose={() => handleCloseModal('quickStart')}
                    isMobile={isMobile}
                    isMediumScreen={isMediumScreen}
                />
            )}
            {modals.newPlayers && (
                <NewPlayersModal
                    handleClose={() => handleCloseModal('newPlayers')}
                    setOpenInventory={() => handleOpenModal('inventory')}
                    isMobile={isMobile}
                />
            )}
            <AdvertModal isOpen={modals.advert} onClose={() => handleCloseModal('advert')} />
        </>
    );
};

export default BattlegroundModals;
