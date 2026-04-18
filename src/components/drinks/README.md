# Drink System Documentation

This directory contains the modular drink system that makes it easy to add, remove, or modify drinks in the radio app.

## 🏗️ Architecture Overview

The drink system consists of:

1. **DrinkRenderer.tsx** - Generic component that renders any drink with active/passive states
2. **drinks.tsx** (in constants/) - Centralized drink registry with SVG definitions
3. **DrinkIcon.tsx** - Individual drink icon component with interaction handling
4. **DrinkCarousel.tsx** - 3D carousel that displays all drinks

## 🎨 Adding a New Drink

To add a new drink, simply add an entry to the `DRINK_REGISTRY` array in `/constants/drinks.tsx`:

```tsx
{
  id: 'newdrink',                    // Unique identifier
  name: 'newdrink',                  // Internal name (usually same as id)
  displayName: 'New Drink',         // Display name shown to users
  stations: ['station1', 'station2'], // Radio stations for this drink
  activeSvg: <YourActiveSvg />,      // Colored/animated SVG component
  passiveSvg: <YourPassiveSvg />     // Grayscale/static SVG component
}
```

## 📝 SVG Component Structure

Each drink needs two SVG components:

### Active SVG (Colored/Animated)
```tsx
const YourDrinkActiveSvg = () => (
  <svg
    className="block w-full h-full"
    fill="none"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 WIDTH HEIGHT"
  >
    {/* Optional: CSS animations */}
    <style>{`
      @keyframes yourAnimation {
        /* Your keyframes here */
      }
      .animated-element {
        animation: yourAnimation 2s infinite;
      }
    `}</style>
    
    {/* Your SVG paths, shapes, etc. */}
    <path d="..." fill="#COLOR" stroke="black" />
    
    {/* Optional: Animated elements */}
    <g className="animated-element">
      {/* Animated content */}
    </g>
  </svg>
);
```

### Passive SVG (Grayscale/Static)
```tsx
const YourDrinkPassiveSvg = () => (
  <svg
    className="block w-full h-full"
    fill="none"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 WIDTH HEIGHT"
  >
    {/* Same structure as active but without colors/animations */}
    <path d="..." fill="white" stroke="black" />
  </svg>
);
```

## 🔄 Removing a Drink

To remove a drink, simply delete its entry from the `DRINK_REGISTRY` array. The system will automatically update.

## 🎭 Animation Guidelines

For animated SVGs:

1. **Use CSS animations** inside `<style>` tags within the SVG
2. **Stagger animations** for multiple elements using `animation-delay`
3. **Keep animations smooth** with appropriate easing functions
4. **Use transform-box: fill-box** for element-relative transforms
5. **Test on mobile devices** to ensure good performance

## 🎨 Example: Bubble Animation

```tsx
<style>{`
  @keyframes rise {
    0%   { transform: translateY(0)   scale(0.3); opacity: 0; }
    10%  { transform: translateY(-5px) scale(0.6); opacity: 1; }
    100% { transform: translateY(-90px) scale(1); opacity: 0; }
  }
  
  #bubbles > circle {
    animation: rise 6s infinite ease-in;
    transform-box: fill-box;
    transform-origin: center;
  }
  
  #bubbles > circle:nth-child(1) { animation-delay: 0s; }
  #bubbles > circle:nth-child(2) { animation-delay: 1s; }
  #bubbles > circle:nth-child(3) { animation-delay: 2s; }
`}</style>

<g id="bubbles">
  <circle cx="30" cy="50" r="2" fill="white" stroke="black"/>
  <circle cx="40" cy="60" r="2" fill="white" stroke="black"/>
  <circle cx="50" cy="70" r="2" fill="white" stroke="black"/>
</g>
```

## 🔧 Utility Functions

Available helper functions:

- `getDrinkById(id: string)` - Get drink definition by ID
- `getDrinkIndex(id: string)` - Get drink array index by ID

## 💡 Tips

1. **Use consistent viewBox dimensions** for visual harmony
2. **Keep SVG files organized** with clear element grouping
3. **Test both active and passive states** thoroughly
4. **Consider performance** for complex animations
5. **Use meaningful IDs and classes** for CSS targeting

## 🚀 Quick Start

1. Copy an existing drink entry in `DRINK_REGISTRY`
2. Replace the `id`, `name`, `displayName`, and `stations`
3. Create your `activeSvg` and `passiveSvg` components
4. Test in the app - it should appear automatically in the carousel!