import React from 'react';
import { motion } from 'motion/react';
import DrinkIcon from './DrinkIcon';
import { DRINK_REGISTRY } from '../constants/drinks';

// GRID VIEW (experiment) — to disable: remove <DrinkGridView> from App.tsx
const COLS = 7;
const ITEM_W = 90;   // px
const ITEM_H = Math.round(ITEM_W * 270 / 162); // ~150px, maintains drink aspect ratio
const GAP = 4;
const REPEAT = 10;   // 10 × 14 drinks = 140 tiles

const GRID_W = COLS * ITEM_W + (COLS - 1) * GAP;
const ROWS = Math.ceil((DRINK_REGISTRY.length * REPEAT) / COLS);
const GRID_H = ROWS * ITEM_H + (ROWS - 1) * GAP + 60 + 100; // + top/bottom padding

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
  const tiles = Array.from({ length: DRINK_REGISTRY.length * REPEAT }, (_, i) => ({
    drink: DRINK_REGISTRY[i % DRINK_REGISTRY.length],
    originalIndex: i % DRINK_REGISTRY.length,
  }));

  const dragConstraints = {
    top: -Math.max(0, GRID_H - window.innerHeight),
    bottom: 0,
    left: -Math.max(0, GRID_W - window.innerWidth),
    right: 0,
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <motion.div
        drag
        dragMomentum
        dragElastic={0.08}
        dragConstraints={dragConstraints}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, ${ITEM_W}px)`,
          gap: GAP,
          padding: '60px 0 100px',
          cursor: 'grab',
          touchAction: 'none',
          userSelect: 'none',
        }}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {tiles.map(({ drink, originalIndex }, i) => {
          const isActive = originalIndex === activeDrinkIndex && !isMuted;
          const isThisLoading = originalIndex === loadingDrinkIndex;
          return (
            <motion.div
              key={i}
              onTap={() => onDrinkTap(originalIndex)}
              style={{
                width: ITEM_W,
                height: ITEM_H,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <DrinkIcon
                drinkId={drink.id}
                isActive={isActive}
                isLoading={isThisLoading}
                isPlaying={isActive}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
