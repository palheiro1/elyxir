# Elyxir Recipes — Production Reference

**Source:** Live contract state (`logs5.txt` line 77396; confirmed in `evidence/2026-03-24_pre_live_snapshot/raw/public_getElyxirState.json`)

---

## Mechanic overview

A user submits:
1. **Recipe token** — one specific recipe asset (consumed).
2. **Ingredients** — the required ingredient assets (consumed).
3. **Flask** — one flask asset (consumed, boosts yield; optional/required per job).
4. **Tools** — all four tool assets (locked during job, returned on completion).

Duration: **1 440 – 43 200 blocks** per job.

---

## Tools (required for every recipe)

| Tool | Asset ID |
|------|----------|
| Cauldron | `16510405738781556809` |
| Bellow | `134965209883026568` |
| Ladle | `16675035144675396134` |
| Mortar | `891244524698574104` |

---

## Flask multipliers

| Flask Asset ID | Yield multiplier |
|----------------|-----------------|
| `18264820454208225977` | ×5 |
| `8654762646210741353` | ×4 |
| `10988806909985982048` | ×3 |
| `7733730178178340688` | ×2 |
| `15449537292115398209` (Conical Flask) | ×1 |

---

## Recipes

### 1 — Whispering Gale

| Field | Value |
|-------|-------|
| Recipe asset ID | `13707014208004245427` |
| Output potion | **Whispering Gale** (`6485210212239811`) |

**Ingredients (1× each):**

| Ingredient | Asset ID |
|------------|----------|
| Crystalline water | `13321324699537252353` |
| Horn dust | `9093191442487829960` |
| Feather | `11386383170019744285` |
| Skin | `9627155908350599600` |

---

### 2 — Tideheart

| Field | Value |
|-------|-------|
| Recipe asset ID | `5014026648203178396` |
| Output potion | **Tideheart** (`7582224115266007515`) |

**Ingredients (1× each):**

| Ingredient | Asset ID |
|------------|----------|
| Fetid water | `7464041035414516620` |
| Cloud | `15521713672709080827` |
| Bigfoot hair | `2380273644117095987` |
| Mustard seeds | `2820535047226119418` |
| Poison herb | `15080124236445648438` |

---

### 3 — Stoneblood

| Field | Value |
|-------|-------|
| Recipe asset ID | `1960378025858544673` |
| Output potion | **Stoneblood** (`10474636406729395731`) |

**Ingredients (1× each):**

| Ingredient | Asset ID |
|------------|----------|
| Holy water | `12308228721908498397` |
| Ash | `12210617625866540653` |
| Garden soil | `9422436625653721006` |
| Garden flower | `7879802689430656608` |
| Vampire fang | `14451010716011965584` |

---

### 4 — Eternal Silk

| Field | Value |
|-------|-------|
| Recipe asset ID | `12569558571118274638` |
| Output potion | **Eternal Silk** (`5089659721388119266`) |

**Ingredients (1× each):**

| Ingredient | Asset ID |
|------------|----------|
| Holy water | `12308228721908498397` |
| Garden soil | `9422436625653721006` |
| Rahu's saliva | `17969181894960429964` |
| Himalayan snow | `9859593227468066316` |

---

### 5 — Coral

| Field | Value |
|-------|-------|
| Recipe asset ID | `12033558477889085358` |
| Output potion | **Coral** (`8693351662911145147`) |

**Ingredients (1× each):**

| Ingredient | Asset ID |
|------------|----------|
| Sea water | `16876168465973703622` |
| Rainbow shred | `18140737140039335538` |
| Lightning | `9289482442465517140` |
| Lava | `955451625820789680` |

---

### 6 — Feathered Flame

| Field | Value |
|-------|-------|
| Recipe asset ID | `12177531144011278176` |
| Output potion | **Feathered Flame** (`11206437400477435454`) |

**Ingredients (1× each):**

| Ingredient | Asset ID |
|------------|----------|
| Crystalline water | `13321324699537252353` |
| Feather | `11386383170019744285` |
| Lightning | `9289482442465517140` |
| Araucaria resin | `7081966488954575750` |

---

### 7 — Shifting Dunes

| Field | Value |
|-------|-------|
| Recipe asset ID | `13408138407764096853` |
| Output potion | **Shifting Dunes** (`12861522637067934750`) |

**Ingredients (1× each):**

| Ingredient | Asset ID |
|------------|----------|
| Sea water | `16876168465973703622` |
| Desert sand | `3042874600616626102` |
| Diamond | `7384993574556043649` |

---

### 8 — Forgotten Grove

| Field | Value |
|-------|-------|
| Recipe asset ID | `14852902787489380032` |
| Output potion | **Forgotten Grove** (`3858707486313568681`) |

**Ingredients (1× each):**

| Ingredient | Asset ID |
|------------|----------|
| Sea water | `16876168465973703622` |
| Bone powder | `10290172289119183466` |
| Kangaroo hair | `1748542894784204097` |
| Wolf fang | `7563318252261495089` |

---

## Summary table

| # | Potion | Recipe asset ID | Ingredient count |
|---|--------|-----------------|-----------------|
| 1 | Whispering Gale | `13707014208004245427` | 4 |
| 2 | Tideheart | `5014026648203178396` | 5 |
| 3 | Stoneblood | `1960378025858544673` | 5 |
| 4 | Eternal Silk | `12569558571118274638` | 4 |
| 5 | Coral | `12033558477889085358` | 4 |
| 6 | Feathered Flame | `12177531144011278176` | 4 |
| 7 | Shifting Dunes | `13408138407764096853` | 3 |
| 8 | Forgotten Grove | `14852902787489380032` | 4 |

> All 8 recipes require the same 4 tools: Cauldron, Bellow, Ladle, Mortar.
