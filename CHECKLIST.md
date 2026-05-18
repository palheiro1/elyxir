ELYXIR TEST #2 ACCEPTANCE CHECKLIST

Goal: Confirm Elyxir is ready to exit Test #2 and proceed to Private Testing

Functionality (must all pass)

• [ ] Inventory page loads and displays correct item balances from Omno API
• [ ] Market page shows live DEX data and allows price checks
• [ ] History page renders transaction history without errors
• [ ] Alchemy planner correctly simulates recipes using elyxirProcesses.js config
• [ ] Bridge flows (ERC-20, ERC-1155, GIFTZ) load and display expected token sections
• [ ] Wallet connection works for Ardor and MetaMask paths
• [ ] No console errors on any primary page load

Omno Integration (must all pass)

• [ ] getElyxirState returns expected data for test accounts
• [ ] getIncubationState returns expected data for test accounts
• [ ] getOmnoUserState item balances match UI display
• [ ] Recipe outcomes in UI align with Omno-side state (no drift)

Performance & Stability

• [ ] Page load < 3s on standard connection
• [ ] No crashes or hangs during 30-min usage session
• [ ] Mobile viewport usable (basic responsiveness)

UX & Copy

• [ ] "Start Crafting" clearly indicates simulation vs onchain execution
• [ ] No placeholder text or broken i18n strings
• [ ] Error states have helpful messages (not raw errors)

Bugs

• [ ] Zero critical bugs open
• [ ] ≤ 3 moderate bugs open (with documented workarounds)