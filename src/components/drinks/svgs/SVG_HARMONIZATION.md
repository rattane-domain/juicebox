# SVG Harmonization System v15.0

## 📐 Standard ViewBox
**All drink SVGs must use:** `viewBox="0 0 150 250"` (Portrait 3:5 ratio)

This ensures:
- ✅ Consistent optical size across all drinks
- ✅ Perfect alignment between Active/Passive/Loading states
- ✅ Drinks in carousel, start screen, and all states are identical in size
- ✅ Portrait format 3:5 matches vertical drink containers (glasses, bottles)

## 📁 File Structure

Each drink has **3 separate files**:
```
/components/drinks/svgs/
├── {DrinkName}Active.tsx    (Color version)
├── {DrinkName}Passive.tsx   (Grayscale version)
└── {DrinkName}Loading.tsx   (Loading state)
```

Example:
```
MartiniActive.tsx
MartiniPassive.tsx
MartiniLoading.tsx
```

## 🎯 SVG Template (Copy-Paste Friendly!)

```tsx
export default function MartiniActive() {
  return (
    <svg 
      viewBox="0 0 150 250" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Your paths here - centered at ~75,125 */}
      <path d="..." fill="..." stroke="..."/>
    </svg>
  );
}
```

**Important:**
- NO props or parameters
- ONLY the `<svg>` element with paths
- ViewBox must be exactly `"0 0 150 250"` (Portrait 3:5 ratio)
- Content should be optically centered in the viewBox (around x:75, y:125)

## 🔄 Updating SVGs

1. Export from Figma with ViewBox `0 0 150 250` (Portrait 3:5)
2. Optically center content at ~75,125
3. Copy the SVG code
4. Paste into the respective file (Active/Passive/Loading)
5. Ensure the function name matches the filename
6. Done! No code changes needed

## 🎨 Loading State

Loading SVGs are currently copies of Passive versions.
The DrinkRenderer adds a pulsing opacity animation automatically:
```tsx
opacity: [0.5, 1, 0.5] // Smooth pulse
duration: 1.5s // Slow and calm
```

You can create custom Loading SVGs (e.g., with shimmer effects) by:
1. Editing the `{DrinkName}Loading.tsx` file
2. Keeping the same ViewBox `0 0 250 150`
3. The animation will still apply automatically

## 🧪 Testing Checklist

After updating SVGs, verify:
- [ ] All 3 states (Active/Passive/Loading) are aligned
- [ ] Drink size is consistent with other drinks
- [ ] No visual artifacts or clipping
- [ ] Loading state pulses smoothly
- [ ] ViewBox is exactly `"0 0 150 250"` (Portrait 3:5)

## 📊 Benefits

✅ **Consistency**: All drinks same optical size  
✅ **Maintainability**: Simple copy/paste workflow  
✅ **UX**: Smooth loading states  
✅ **Scalability**: Easy to add new drinks  
✅ **Clean Code**: No magic numbers or calculations  

## 🗑️ Files to Delete (Old numbered system)

These files are legacy and can be deleted:
- `01_JuiceboxActive.tsx`
- `02_MartiniActive.tsx`
- `03_SprudelActive.tsx`
- `04_WasserActive.tsx`
- `05_SunriseActive.tsx`
- `07_NegroniActive.tsx`
- `08_MilkshakeActive.tsx`
- All corresponding Passive versions

Use the non-numbered versions instead (e.g., `MartiniActive.tsx`).
