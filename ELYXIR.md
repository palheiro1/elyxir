# Gameplay and UX

Elyxir is an extension of the* [x] **Create an item component**

  ## 🛒 Marketplace

* [x] **Add an "ITEMS" option to the market## 🛠️ Additional Notes

* [x] Reuse styling from existing components (cards, buttons, grids) to maintain a consistent look and feel.
* [x] Ensure new components follow the project's React/Chakra UI patterns.
* [x] Backend/blockchain integration is out of scope here—UI components may use mock data or existing state management.ctor**

  * Modify `src/components/Pages/MarketPage/PairSelector/PairSelector.js` so the user can choose `ITEMS` alongside `CARD` and `CURRENCIES`.

* [x] **Create an ItemMarket component**

  * Base it on `CardMarket.js` (or a similar file).
  * Display available potions for buy/sell and adapt the order grid to handle item-specific data.

* [x] **Render ItemMarket when selected**

  * In `src/components/Pages/MarketPage/Market.js`, detect when `marketCurrency === 'ITEMS'` and show `ItemMarket`.rc/components/Cards/Card.js` or build a similar file (`ItemCard.js`).
  * Display the potion image, name, and basic details.

* [x] **Add an Item grid**

  * In `src/components/Items`, create `GridItems.js` mirroring `GridCards.js`.
  * Handle responsive column counts the same way.

* [x] **Extend Inventory page with a switch**

  * Update `src/components/Pages/InventoryPage/Inventory.js`.
  * Introduce state to toggle between "Cards," "Items," and optionally "All."
  * Use a switch component (e.g. `SectionSwitch.js`) to change which grid is shown.

* [x] **Integrate item filters (optional)**

  * If cards have filters via `SortAndFilterCards`, create a simplified `SortAndFilterItems` to filter potions by type or bonus.* trading-card universe focused on potion creation and use. In its MVP form, players can obtain pre-made potions—no crafting or ingredient system yet—and deploy them to gain small advantages in Battlegrounds.

## Core Concepts

* **Potions as Items**

  * Single-use items granting **+1 Power** to a creature under specific conditions (e.g., by Medium or Continent).
  * Usable only by the attacking army in this release.
* **Inventory and Marketplace**

  * Potions live in the same wallet as cards; a switch toggles between Card view and Item view.
  * Potions appear on the Marketplace for buying/selling like cards.
* **Bounty and Pack Opening**

  * Bounty rewards can include potions.
  * Every tenth pack may award a potion, as an extra slot or replacing a card.
* **Battlegrounds Integration**

  * Players equip one potion before launching an attack.
  * Deployed potions apply the +1 Power bonus when conditions are met.

## User Experience Flow

1. **Collecting Potions**

   * Rewards from bounty quests or pack openings.
   * Displayed in inventory grid alongside cards.
2. **Trading Potions**

   * “ITEMS” option on Marketplace to list/bid/offers.
   * Market UI mirrors card trading experience.
3. **Using Potions**

   * Item picker on Battlegrounds screen to equip a single potion per battle.
   * Potion consumed at battle end and bonus applied.

---

*Esta lista guia a implementação dos componentes de UI e fluxos de interação para dar suporte a potions (itens) em todas as áreas relevantes do projeto.*

---

# ✅ Implementation Checklist

## 🧪 Inventory

* [ ] **Create an item component**

  * Duplicate `src/components/Cards/Card.js` or build a similar file (`ItemCard.js`).
  * Display the potion image, name, and basic details.

* [ ] **Add an Item grid**

  * In `src/components/Items`, create `GridItems.js` mirroring `GridCards.js`.
  * Handle responsive column counts the same way.

* [ ] **Extend Inventory page with a switch**

  * Update `src/components/Pages/InventoryPage/Inventory.js`.
  * Introduce state to toggle between “Cards,” “Items,” and optionally “All.”
  * Use a switch component (e.g. `SectionSwitch.js`) to change which grid is shown.

* [ ] **Integrate item filters (optional)**

  * If cards have filters via `SortAndFilterCards`, create a simplified `SortAndFilterItems` to filter potions by type or bonus.

## 🛒 Marketplace

* [ ] **Add an “ITEMS” option to the market selector**

  * Modify `src/components/Pages/MarketPage/PairSelector/PairSelector.js` so the user can choose `ITEMS` alongside `CARD` and `CURRENCIES`.

* [ ] **Create an ItemMarket component**

  * Base it on `CardMarket.js` (or a similar file).
  * Display available potions for buy/sell and adapt the order grid to handle item-specific data.

* [ ] **Render ItemMarket when selected**

  * In `src/components/Pages/MarketPage/Market.js`, detect when `marketCurrency === 'ITEMS'` and show `ItemMarket`.

## 🎯 Bounty

* [x] **Include potions in bounty rewards**

  * Update `src/components/Pages/BountyPage` so potion items are part of the reward pool.
  * Extend any reward grid or list to show potion icons.

* [x] **Handle user inventory for bounty**

  * Reuse the new item grid to let players select or burn potions if required by the bounty flow.

## 🎁 Pack Opening

* [x] **Update pack opening modal**

  * Modify `src/components/Modals/OpenPackDialog/OpenPackDialog.js` to present a potion when one is awarded.
  * Reuse the card component layout or create a simple item display.

* [x] **Animate potion reveals**

  * If packs animate card opening, apply the same animation when revealing a potion.

## ⚔️ Battlegrounds

* [x] **Create an Item deployment page**

  * Within `src/components/Pages/BattlegroundsPage/Components/Inventory`, add a section for potions similar to existing Army deployment.
  * Allow users to transfer potions to and from the battleground inventory.

* [x] **Provide an item picker on the battle screen**

  * In `src/components/Pages/BattlegroundsPage/Components/BattleWindow` (or equivalent), add a dropdown or modal to choose one potion for the attacking army.
  * Show chosen potion in the battle confirmation view (icon/name next to the attack button).

## 🛠️ Additional Notes

* [ ] Reuse styling from existing components (cards, buttons, grids) to maintain a consistent look and feel.
* [ ] Ensure new components follow the project’s React/Chakra UI patterns.
* [ ] Backend/blockchain integration is out of scope here—UI components may use mock data or existing state management.

---

> **Notas Finais:**
>
> * Reutilize estilos (cards, botões, grids) para consistência visual.
> * Siga padrões React/Chakra UI do projeto.
> * Integração blockchain/backend está fora de escopo; use mocks ou estado existente.
