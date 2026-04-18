# 🍹 Drink SVG Components

Simple directory for drink SVG components. Each drink has **Active** (colored) and **Passive** (grayscale) versions.

## 📍 Quick Position Lookup

**Need to know which file to replace?** See `DRINK_POSITIONS.md` for the complete position-to-file mapping.

## 🎨 How to Replace an SVG

1. **Find your drink** in `DRINK_POSITIONS.md`
2. **Open the corresponding file** (e.g., `MartiniActive.tsx`)  
3. **Replace the SVG content** with your new design
4. **Keep the file name** to avoid breaking imports

## 🌈 Active vs Passive

- **Active** = Colored, can have animations (when drink is selected)
- **Passive** = Grayscale/white, no animations (when not selected)

## 📝 Template Structure

```tsx
export default function DrinkNameActive() {
  return (
    <svg
      className="block w-full h-full"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 WIDTH HEIGHT"  // Update these dimensions
    >
      {/* Your SVG content here */}
      <path d="..." fill="#color" stroke="black" />
    </svg>
  );
}
```

## 🔄 Current Status

Mix of numbered files (`01_JuiceboxActive.tsx`) and original files (`JuiceboxActive.tsx`). Both work fine - use the position reference to know which file to edit.

---

**That's it!** Check `DRINK_POSITIONS.md` for the complete position mapping.