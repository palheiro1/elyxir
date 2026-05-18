# Elyxir UI Integration Guide

## Context

Elyxir now has two relevant protocol gates:

- `RECIPE_L1_CHECK_HEIGHT = 4471100`
- `ELYXIR_LIFECYCLE_FIX_HEIGHT = 4472500`

The UI must distinguish **legacy jobs** from **new lifecycle jobs**, because asset movement timing changes after `4472500`.

## Recipe Permission

From block `4471100` onward, the recipe token is checked as **L1 Ardor wallet possession**.

The user does **not** need to transfer the recipe token to Omno.

UI copy should say:

> Recipe required: you must hold this recipe in your Ardor account. It will not be transferred or consumed.

Do not show the recipe as an escrowed, burned, or returned item.

## Lifecycle Behavior

### Before `4472500`

Legacy behavior:

- Ingredients + flask are burned at create time.
- Tools are returned immediately at create time.
- If successful, potion is delivered later at `endHeight`.
- Failed/catastrophic outcomes are already settled at create time.

UI should show:

- Tools returned immediately after create confirmation.
- Potion pending until `endHeight` only if success.
- No “tools locked until completion” message for legacy jobs.

### From `4472500` Onward

New behavior:

- Ingredients, flask, and tools are locked in Elyxir escrow at create time.
- Nothing is burned or returned immediately.
- On success at `endHeight`:
  - ingredients + flask are burned
  - tools are returned
  - potion is delivered
- On normal failure at `endHeight`:
  - ingredients are burned
  - tools + flask are returned
- On catastrophic failure at `catastropheHeight`:
  - ingredients + flask + tools are burned
  - job remains visible until `endHeight`/finalization if backend still exposes it

UI copy should say:

> Your tools are locked during alchemy and return when the potion resolves.

For success:

> Potion completed. Tools returned and potion delivered.

For normal failure:

> Alchemy failed. Ingredients were consumed; tools and flask returned.

For catastrophe:

> Catastrophic failure. Ingredients, flask, and tools were lost.

## Job Display Rules

Prefer backend job field `escrowed` when available.

- `escrowed: true`: use new lifecycle UI.
- missing or `false`: use legacy UI.
- If no job exists after create and no potion pending, show the operation as rejected or already settled depending on transaction logs.

For active jobs:

- Show `startHeight`
- Show `endHeight`
- Show current block progress
- Show `durationBlocks = endHeight - startHeight`
- If present, show `catastropheHeight` only after catastrophe is known or if the product deliberately exposes precomputed risk details.

Recommended status labels:

- `STARTED`: In alchemy
- `EXPLODED`: Failed
- `CATASTROPHIC`: Catastrophic failure
- `FINALIZED`: Completed

## Timeline UI

For `escrowed: true`, show a timeline like:

1. Submitted
2. Assets locked
3. Alchemy in progress
4. Resolution at `endHeight`

On success, final step becomes:

- Ingredients + flask burned
- Tools returned
- Potion delivered

On normal failure:

- Ingredients burned
- Tools + flask returned

On catastrophic failure:

- All locked assets burned at `catastropheHeight`

## Important UI Warning

Do not tell the user “tools returned” immediately after create for jobs created at or after block `4472500`.

Correct text after create:

> Alchemy started. Ingredients, flask, and tools are locked until resolution.

## Testing Checklist

- Test recipe held in Ardor wallet but not deposited to Omno: should pass after `4471100`.
- Test create after `4472500`: tools should not appear as returned immediately.
- Test success completion: potion and tools should arrive in the same settlement block.
- Test normal failure: tools + flask return at `endHeight`.
- Test catastrophic failure: tools are burned, not returned.
