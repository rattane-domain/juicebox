# 🍹 Drink Position Reference

Simple lookup table for pasting new SVGs. Each drink has a fixed position in the carousel.

## Position → File Mapping

| Pos | Drink Name | Current SVG Files | Station |
|-----|------------|-------------------|---------|
| **1** | Juicebox | `JuiceboxActive.tsx` `JuiceboxPassive.tsx` | Groove Salad |
| **2** | Martini | `MartiniActive.tsx` `MartiniPassive.tsx` | FIP |
| **3** | Sprudel | `SprudelActive.tsx` `SprudelPassive.tsx` | Gri Balkon |
| **4** | Wasser | `WasserActive.tsx` `WasserPassive.tsx` | Deep Space One |
| **5** | Sunrise | `SunriseActive.tsx` `SunrisePassive.tsx` | Ibiza Sonica |
| **6** | Juicebox Lichi | `KirscheActive.tsx` `KirschePassive.tsx` | Ibiza SoniCalm |
| **7** | Negroni | `NegroniActive.tsx` `NegroniPassive.tsx` | Dublab |
| **8** | Milkshake | `MilkshakeActive.tsx` `MilkshakePassive.tsx` | Radio Paradise |
| **9** | Mojito | `MohitoActive.tsx` `MohitoPassive.tsx` | Byte FM |
| **10** | Pina Colada | `PinaActive.tsx` `PinaPassive.tsx` | Los 40 Urban |
| **11** | Cola | `ColaActive.tsx` `ColaPassive.tsx` | Reprezent |
| **12** | Juicebox Orange | `JuiceboxOrangeActive.tsx` `JuiceboxOrangePassive.tsx` | NTS Radio |
| **13** | Manhattan | `ManhattanActive.tsx` `ManhattanPassive.tsx` | Frisky deep |
| **14** | Bubbletea | `BubbleActive.tsx` `BubblePassive.tsx` | BBC Radio 1 |
| **15** | Energy Drink | `RedbullActive.tsx` `RedbullPassive.tsx` | George FM |
| **16** | Ma Chérie | `WeinActive.tsx` `WeinPassive.tsx` | Rinse France |
| **17** | Beer | `BierActive.tsx` `BierPassive.tsx` | Idobi |
| **18** | Melon | `MelonActive.tsx` `MelonPassive.tsx` | Radio Vinyle |
| **19** | Espresso | `EspressoActive.tsx` `EspressoPassive.tsx` | Evosonic |
| **20** | Whisky | `WhiskyActive.tsx` `WhiskyPassive.tsx` | Lofi Girl |
| **21** | Coco | `CocoActive.tsx` `CocoPassive.tsx` | Lusophonica |
| **22** | Milk & Honey | `MilchActive.tsx` `MilchPassive.tsx` | Ambient Sleeping Pill |

## How to Use

1. **Find your drink position** in the table above
2. **Replace the existing SVG files** with your new ones
3. **Keep the same file names** to avoid breaking imports
4. Each drink needs both an `Active.tsx` (colored) and `Passive.tsx` (grayscale) version

## Missing Files to Create
✅ **All positions now have placeholder files!**

**Ready for your SVGs:**
- Position 12: `JuiceboxOrangeActive.tsx` + `JuiceboxOrangePassive.tsx` *(placeholder created)*
- Position 19: `EspressoActive.tsx` + `EspressoPassive.tsx` *(placeholder created)*

---
*That's it! Simple lookup for drink positions.*