## Incubation: Card → Ingredient Mapping

The Incubation mechanic lets users stake cards (locked for one cycle of **5 040 blocks**). On harvest, the staked cards are returned together with an ingredient yield. Yield = `quantity_staked ÷ rarity_ratio`. The quantity must be a positive multiple of the rarity ratio.

| Rarity | Ratio (min. cards per slot) | Yield per batch |
|--------|:--------------------------:|:---------------:|
| COMMON | 10 | 1 ingredient per 10 cards |
| RARE | 5 | 1 ingredient per 5 cards |
| EPIC | 2 | 1 ingredient per 2 cards |
| SPECIAL | 1 | 1 ingredient per 1 card |

### Card → Ingredient Reference

| Card Name | Card ID | Min. Cards Required | Ingredient Name | Ingredient ID | Rarity |
|-----------|---------|:-------------------:|-----------------|---------------|--------|
| /Kaggen | `8825927167203958938` | 10 | Garden flower | `7879802689430656608` | COMMON |
| Adaro | `18101012326255288772` | 10 | Rainbow shred | `18140737140039335538` | COMMON |
| Caaporá | `8717959006135737805` | 10 | Araucaria resin | `7081966488954575750` | COMMON |
| Catoblepas | `15284691712437925618` | 10 | Poison herb | `15080124236445648438` | COMMON |
| Dhampir | `609721796834652174` | 10 | Vampire fang | `14451010716011965584` | COMMON |
| Droemerdene | `10444425886085847503` | 10 | Kangaroo hair | `1748542894784204097` | COMMON |
| Dudugera | `12936439663349626618` | 5 | Cloud | `15521713672709080827` | RARE |
| Dybbuk | `9118586585609900793` | 2 | Holy water | `12308228721908498397` | EPIC |
| Grootslang | `14906207210027210012` | 1 | Diamond | `7384993574556043649` | SPECIAL |
| Haechi | `11654119158397769364` | 5 | Ash | `12210617625866540653` | RARE |
| Karkadann | `7536385584787697086` | 10 | Horn dust | `9093191442487829960` | COMMON |
| Kel Essuf | `12313032092046113556` | 10 | Desert sand | `3042874600616626102` | COMMON |
| Macihuatli | `6086151229884242778` | 10 | Mustard seeds | `2820535047226119418` | COMMON |
| Nei Tituaabine | `10917692030112170713` | 10 | Lightning | `9289482442465517140` | COMMON |
| Ninki Nanka | `1328293559375692481` | 2 | Fetid water | `7464041035414516620` | EPIC |
| Pele | `15778342868690621160` | 2 | Lava | `955451625820789680` | EPIC |
| Pua Tu Tahi | `2795734210888256790` | 10 | Sea water | `16876168465973703622` | COMMON |
| Rahu | `9451976923053037726` | 10 | Rahu's saliva | `17969181894960429964` | COMMON |
| Rompo | `374078224198142471` | 10 | Bone powder | `10290172289119183466` | COMMON |
| Sasquatch | `8504616031553931056` | 1 | Bigfoot hair | `2380273644117095987` | SPECIAL |
| Şahmaran | `1770779863759720918` | 5 | Garden soil | `9422436625653721006` | RARE |
| Tsenahale | `3758988694981372970` | 2 | Feather | `11386383170019744285` | EPIC |
| Tupilaq | `488367278629756964` | 10 | Skin | `9627155908350599600` | COMMON |
| Werewolf | `13430257599807483745` | 10 | Wolf fang | `7563318252261495089` | COMMON |
| Yeti | `7891814295348826088` | 10 | Himalayan snow | `9859593227468066316` | COMMON |

> **Note — Mokèlé-mbèmbé** (`10956456574154580310`, RARE): this card appears in the rarity classification but has **no ingredient mapping** in the current incubation configuration. It cannot be incubated. The runtime logs a warning for it via `getCardIdsWithoutIngredient()`.