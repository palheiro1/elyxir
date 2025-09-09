## Project Cleanup Plan: Remove Unused Elements

### 1. Audit the Codebase
- List all components, pages, Redux slices, utilities, and assets currently in the project.
- Identify which files and modules are actually used by the Elyxir app and which are legacy wallet code.

### 2. Remove Unused Components and Pages
- Delete all React components, pages, and containers that are not referenced by the Elyxir app.
- Remove unused modal dialogs, widgets, and navigation elements.

### 3. Clean Up Redux and State Management
- Remove Redux slices, actions, reducers, and store logic that are not used by Elyxir.
- Delete related selectors and middleware if not needed.

### 4. Prune Utilities and Data Files
- Delete utility functions, helpers, and data files that are not imported anywhere in the Elyxir codebase.

### 5. Remove Unused Assets
- Delete images, icons, and static files that are not referenced by the Elyxir UI or logic.

### 6. Clean Up Dependencies
- Remove unused npm/yarn dependencies from `package.json` and run `npm prune` or `yarn install --check-files`.

### 7. Update Documentation
- Revise the README and other docs to reflect the new, focused Elyxir app scope.

### 8. Test and Refactor
- Run the app and tests to ensure nothing is broken.
- Refactor code for clarity and maintainability after cleanup.
