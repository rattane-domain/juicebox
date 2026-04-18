import React from 'react';
import { motion } from 'motion/react';
import { DrinkRenderer } from './drinks/DrinkRenderer';
import { getDrinkById } from '../constants/drinks';

interface DrinkIconProps {
  drinkId: string;
  isActive: boolean;
  isLoading?: boolean;
  isPlaying?: boolean;
  onClick?: () => void;
}

export default function DrinkIcon({ 
  drinkId, 
  isActive, 
  isLoading = false, 
  isPlaying = false, 
  onClick
}: DrinkIconProps) {
  const drink = getDrinkById(drinkId);
  
  if (!drink) {
    console.warn(`Drink with id "${drinkId}" not found in registry`);
    return null;
  }

  return (
    <motion.div
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      style={{
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <DrinkRenderer
        isActive={isActive}
        isLoading={isLoading}
        activeSvg={drink.activeSvg}
        passiveSvg={drink.passiveSvg}
        loadingSvg={drink.loadingSvg}
      />
    </motion.div>
  );
}
