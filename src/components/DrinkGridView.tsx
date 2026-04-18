import React from 'react';
import DrinkIcon from './DrinkIcon';
import { DRINK_REGISTRY } from '../constants/drinks';

// GRID VIEW (experiment) — to disable: remove <DrinkGridView> from App.tsx
const COLUMNS = 6;
const ITEM_W = 72; // px per item
const GAP = 3;
const REPEAT = 14; // 14 × 14 drinks = 196 tiles, ~33 rows

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
        overflow: 'scroll',
        touchAction: 'pan-x pan-y',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLUMNS}, ${ITEM_W}px)`,
          gap: GAP,
          padding: `60px ${GAP}px 100px`,
          width: 'max-content',
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
                width: ITEM_W,
                aspectRatio: '162 / 270',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
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
