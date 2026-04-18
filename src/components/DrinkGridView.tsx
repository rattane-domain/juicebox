import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import DrinkIcon from './DrinkIcon';
import { DRINK_REGISTRY } from '../constants/drinks';

// GRID VIEW (experiment) — to disable: remove <DrinkGridView> from App.tsx
const ITEM_W = 100;  // px
const GAP = 8;
const REPEAT = 60;   // 14 × 60 = 840 tiles — never hits bottom in practice

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
  const { cols, gridW, gridH, itemH, dragConstraints, tiles } = useMemo(() => {
    const sw = window.innerWidth;
    const sh = window.innerHeight;
    // Grid is 1.5× screen width so there's always room to drag horizontally
    const cols = Math.ceil((sw * 1.5) / (ITEM_W + GAP));
    const gridW = cols * ITEM_W + (cols - 1) * GAP;
    const itemH = Math.round(ITEM_W * 270 / 162);
    const totalItems = DRINK_REGISTRY.length * REPEAT;
    const rows = Math.ceil(totalItems / cols);
    const gridH = rows * itemH + (rows - 1) * GAP + 60 + 100;

    const tiles = Array.from({ length: totalItems }, (_, i) => ({
      drink: DRINK_REGISTRY[i % DRINK_REGISTRY.length],
      originalIndex: i % DRINK_REGISTRY.length,
    }));

    const dragConstraints = {
      top: -Math.max(0, gridH - sh),
      bottom: 0,
      left: -Math.max(0, gridW - sw),
      right: 0,
    };

    return { cols, gridW, gridH, itemH, dragConstraints, tiles };
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <motion.div
        drag
        dragMomentum
        dragElastic={0.05}
        dragConstraints={dragConstraints}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${ITEM_W}px)`,
          gap: GAP,
          padding: '60px 0 100px',
          width: gridW,
          touchAction: 'none',
          userSelect: 'none',
          cursor: 'grab',
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
              style={{ width: ITEM_W, height: itemH, cursor: 'pointer' }}
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
