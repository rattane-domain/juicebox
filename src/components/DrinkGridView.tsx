import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { motion, useMotionValue } from 'motion/react';
import DrinkIcon from './DrinkIcon';
import { DRINK_REGISTRY } from '../constants/drinks';

// GRID VIEW (experiment) — to disable: remove <DrinkGridView> from App.tsx
const ITEM_W = 100;
const GAP = 14;
const REPEAT = 15; // 15 × 14 = 210 tiles — enough for endless feel

interface DrinkGridViewProps {
  activeDrinkIndex: number | null;
  isMuted: boolean;
  onDrinkTap: (originalIndex: number) => void;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export default function DrinkGridView({ activeDrinkIndex, isMuted, onDrinkTap }: DrinkGridViewProps) {
  // Which specific tile instance the user last tapped (not which drink)
  const [activeTileIdx, setActiveTileIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { cols, gridW, gridH, itemH, constraints, startX, startY, tiles } = useMemo(() => {
    const sw = window.innerWidth;
    const sh = window.innerHeight;
    // 2.5× screen width gives plenty of horizontal drag room
    const cols = Math.ceil((sw * 2.5) / (ITEM_W + GAP));
    const gridW = cols * ITEM_W + (cols - 1) * GAP;
    const itemH = Math.round(ITEM_W * 270 / 162);
    const totalItems = DRINK_REGISTRY.length * REPEAT;
    const rows = Math.ceil(totalItems / cols);
    const gridH = rows * (itemH + GAP) + 60 + 100;

    const tiles = Array.from({ length: totalItems }, (_, i) => ({
      drink: DRINK_REGISTRY[i % DRINK_REGISTRY.length],
      originalIndex: i % DRINK_REGISTRY.length,
    }));

    // Start in the center so user can scroll in all directions
    const startX = Math.round((gridW - sw) / 2);
    const startY = Math.round((gridH - sh) / 2);

    const constraints = {
      left: -(gridW - sw),
      right: 0,
      top: -(gridH - sh),
      bottom: 0,
    };

    return { cols, gridW, gridH, itemH, constraints, startX, startY, tiles };
  }, []);

  const x = useMotionValue(-startX);
  const y = useMotionValue(-startY);

  // Desktop: wheel scrolls the canvas in both directions
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    x.set(clamp(x.get() - e.deltaX, constraints.left, 0));
    y.set(clamp(y.get() - e.deltaY, constraints.top, 0));
  }, [x, y, constraints]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <motion.div
        drag
        dragMomentum
        dragElastic={0.05}
        dragConstraints={constraints}
        style={{
          x,
          y,
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
          willChange: 'transform',
        }}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {tiles.map(({ drink, originalIndex }, i) => {
          const isTappedTile = i === activeTileIdx;
          // Loading: this tile was tapped but the drink hasn't become active yet
          const isLoading = isTappedTile && originalIndex !== activeDrinkIndex;
          // Active: this specific tile is the one that was tapped AND it's now playing
          const isActive = isTappedTile && originalIndex === activeDrinkIndex && !isMuted;

          return (
            <motion.div
              key={i}
              onTap={() => {
                setActiveTileIdx(i);
                onDrinkTap(originalIndex);
              }}
              style={{ width: ITEM_W, height: itemH, cursor: 'pointer' }}
            >
              <DrinkIcon
                drinkId={drink.id}
                isActive={isActive}
                isLoading={isLoading}
                isPlaying={isActive}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
