import React from 'react';
import DrinkIcon from './DrinkIcon';
import { DRINK_REGISTRY } from '../constants/drinks';

// GRID VIEW (experiment) — to disable: remove <DrinkGridView> from App.tsx
// Repeat drinks N times for endless scroll feel
const REPEAT = 6;

interface DrinkGridViewProps {
  activeDrinkIndex: number | null;
  loadingDrinkIndex: number | null;
  isMuted: boolean;
  onDrinkTap: (index: number) => void;
}

export default function DrinkGridView({
  activeDrinkIndex,
  loadingDrinkIndex,
  isMuted,
  onDrinkTap,
}: DrinkGridViewProps) {
  const tiles = Array.from({ length: REPEAT * DRINK_REGISTRY.length }, (_, i) => ({
    drink: DRINK_REGISTRY[i % DRINK_REGISTRY.length],
    originalIndex: i % DRINK_REGISTRY.length,
  }));

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 4,
          padding: '56px 4px 96px',
        }}
      >
        {tiles.map(({ drink, originalIndex }, i) => {
          const isActive = originalIndex === activeDrinkIndex && !isMuted;
          const isThisLoading = originalIndex === loadingDrinkIndex;
          return (
            <button
              key={i}
              onClick={() => onDrinkTap(originalIndex)}
              style={{
                display: 'block',
                aspectRatio: '162 / 270',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                width: '100%',
              }}
            >
              <DrinkIcon
                drinkId={drink.id}
                isActive={isActive}
                isLoading={isThisLoading}
                isPlaying={isActive}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
