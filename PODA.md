
## Files, Folders, and Code Not Required for Elyxir App

The following files, folders, and code are not required for the Elyxir app and should be removed as part of the cleanup:

### Components/Pages (remove all except ElyxirPage and direct dependencies)
- `src/components/Pages/AccountPage/`
- `src/components/Pages/BattlegroundsPage/`
- `src/components/Pages/BookPage/`
- `src/components/Pages/BountyPage/`
- `src/components/Pages/Bridge/`
- `src/components/Pages/ChatPage/`
- `src/components/Pages/HistoryPage/`
- `src/components/Pages/HomePage/`
- `src/components/Pages/InventoryPage/`
- `src/components/Pages/LoginPage/`
- `src/components/Pages/MarketPage/`
- `src/components/Pages/WelcomePage/`

### Standalone Components (remove unless used by Elyxir)
- `src/components/BountyWidget/`
- `src/components/Cards/` (except GridCards.js if used)
- `src/components/ColorModeSwitch/`
- `src/components/CurrencyMenu/`
- `src/components/Items/` (except GridItems.js if used)
- `src/components/LanguageSwitcher.js`
- `src/components/Loader/`
- `src/components/LoadingSpinner/`
- `src/components/Logo/`
- `src/components/Modals/`
- `src/components/Navigation/`
- `src/components/QRReader/`
- `src/components/ResponsiveTable/`
- `src/components/ShowQR/`
- `src/components/SortAndFilters/` (except SortAndFilterItems.js if used)
- `src/components/Tables/`
- `src/components/ui/`

### Redux/State
- `src/redux/` (remove all slices/reducers except those used by Elyxir)

### Pages
- `src/pages/` (remove all except Elyxir entry point, if any)

### Data/Utils
- `src/data/` (remove all except elyxirPotions.js and any direct Elyxir dependencies)
- `src/utils/` (remove all except helpers used by Elyxir)

### Assets
- `src/assets/` (remove all unless referenced by Elyxir)

### Hooks
- `src/hooks/` (remove all except those used by Elyxir)

### Services
- `src/services/` (remove all unless directly used by Elyxir)

### i18n
- `src/i18n/` (remove all unless Elyxir uses translations)

### Themes
- `src/themes/` (keep if used by Elyxir)

### Build/Public
- `build/` and `public/` images and static files (remove all not referenced by Elyxir)

### Scripts/Patches/Docs
- `scripts/`, `patches/`, `docs/` (remove all unless needed for Elyxir)

### App Entrypoint
- Refactor `src/App.js` and routing to only include Elyxir and its dependencies.

- [x] **1. Audit the Codebase**
	- All components, pages, Redux slices, utilities, and assets have been listed and mapped for usage. Elyxir-specific files are identified.

- [x] **2. Remove Unused Components and Pages**
	- All React components, pages, and containers not referenced by the Elyxir app have been removed. Unused modal dialogs, widgets, and navigation elements are deleted.

- [x] **3. Clean Up Redux and State Management**
	- All unused Redux slices, actions, reducers, and store logic have been removed. Only Elyxir-related state management remains.

- [x] **4. Prune Utilities and Data Files**
	- All unused utility functions, helpers, and data files not imported by Elyxir have been deleted.

- [x] **5. Remove Unused Assets**
	- All images, icons, and static files not referenced by the Elyxir UI or logic have been deleted.

- [x] **6. Clean Up Dependencies**
	- All unused npm/yarn dependencies have been removed from `package.json` and `npm prune` has been run.

- [x] **7. Update Documentation**
	- README and other docs have been revised to reflect the new, focused Elyxir app scope.

- [x] **8. Test and Refactor**
	- App and tests have been run to ensure nothing is broken. Code has been refactored for clarity and maintainability after cleanup.
