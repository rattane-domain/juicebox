import React from 'react';
import { getStationConfig } from './stations';

// Import all the authentic SVG components from Figma
import BubbleActive from '../components/drinks/svgs/BubbleActive';
import BubblePassive from '../components/drinks/svgs/BubblePassive';
import SprudelActive from '../components/drinks/svgs/SprudelActive';
import SprudelPassive from '../components/drinks/svgs/SprudelPassive';
import CocoActive from '../components/drinks/svgs/CocoActive';
import CocoPassive from '../components/drinks/svgs/CocoPassive';
import WhiskyActive from '../components/drinks/svgs/WhiskyActive';
import WhiskyPassive from '../components/drinks/svgs/WhiskyPassive';
import ColaActive from '../components/drinks/svgs/ColaActive';
import ColaPassive from '../components/drinks/svgs/ColaPassive';
import MartiniActive from '../components/drinks/svgs/MartiniActive';
import MartiniPassive from '../components/drinks/svgs/MartiniPassive';
import MilkshakeActive from '../components/drinks/svgs/MilkshakeActive';
import MilkshakePassive from '../components/drinks/svgs/MilkshakePassive';
import JuiceboxActive from '../components/drinks/svgs/JuiceboxActive';
import BierActive from '../components/drinks/svgs/BierActive';
import PinaActive from '../components/drinks/svgs/PinaActive';

// Import all the new Active components
import WasserActive from '../components/drinks/svgs/WasserActive';
import SunriseActive from '../components/drinks/svgs/SunriseActive';
import NegroniActive from '../components/drinks/svgs/NegroniActive';
import MohitoActive from '../components/drinks/svgs/MohitoActive';
import ManhattanActive from '../components/drinks/svgs/ManhattanActive';
import RedbullActive from '../components/drinks/svgs/RedbullActive';
import WeinActive from '../components/drinks/svgs/WeinActive';
import KirscheActive from '../components/drinks/svgs/KirscheActive';
import MelonActive from '../components/drinks/svgs/MelonActive';
import MilchActive from '../components/drinks/svgs/MilchActive';
import EspressoActive from '../components/drinks/svgs/EspressoActive';
import JuiceboxOrangeActive from '../components/drinks/svgs/JuiceboxOrangeActive';
import NightStarActive from '../components/drinks/svgs/NightStarActive';

// Import all the passive components from Figma
import KirschePassive from '../components/drinks/svgs/KirschePassive';
import SunrisePassive from '../components/drinks/svgs/SunrisePassive';
import ManhattanPassive from '../components/drinks/svgs/ManhattanPassive';
import RedbullPassive from '../components/drinks/svgs/RedbullPassive';
import JuiceboxPassive from '../components/drinks/svgs/JuiceboxPassive';
import WasserPassive from '../components/drinks/svgs/WasserPassive';
import MohitoPassive from '../components/drinks/svgs/MohitoPassive';
import PinaPassive from '../components/drinks/svgs/PinaPassive';
import NegroniPassive from '../components/drinks/svgs/NegroniPassive';
import BierPassive from '../components/drinks/svgs/BierPassive';
import MelonPassive from '../components/drinks/svgs/MelonPassive';
import MilchPassive from '../components/drinks/svgs/MilchPassive';
import WeinPassive from '../components/drinks/svgs/WeinPassive';
import EspressoPassive from '../components/drinks/svgs/EspressoPassive';
import JuiceboxOrangePassive from '../components/drinks/svgs/JuiceboxOrangePassive';
import NightStarPassive from '../components/drinks/svgs/NightStarPassive';

// Import loading variants (separate files - copy/paste friendly!)
import BubbleLoading from '../components/drinks/svgs/BubbleLoading';
import SprudelLoading from '../components/drinks/svgs/SprudelLoading';
import CocoLoading from '../components/drinks/svgs/CocoLoading';
import WhiskyLoading from '../components/drinks/svgs/WhiskyLoading';
import ColaLoading from '../components/drinks/svgs/ColaLoading';
import MartiniLoading from '../components/drinks/svgs/MartiniLoading';
import MilkshakeLoading from '../components/drinks/svgs/MilkshakeLoading';
import JuiceboxLoading from '../components/drinks/svgs/JuiceboxLoading';
import BierLoading from '../components/drinks/svgs/BierLoading';
import PinaLoading from '../components/drinks/svgs/PinaLoading';
import WasserLoading from '../components/drinks/svgs/WasserLoading';
import SunriseLoading from '../components/drinks/svgs/SunriseLoading';
import NegroniLoading from '../components/drinks/svgs/NegroniLoading';
import MohitoLoading from '../components/drinks/svgs/MohitoLoading';
import ManhattanLoading from '../components/drinks/svgs/ManhattanLoading';
import RedbullLoading from '../components/drinks/svgs/RedbullLoading';
import WeinLoading from '../components/drinks/svgs/WeinLoading';
import KirscheLoading from '../components/drinks/svgs/KirscheLoading';
import MelonLoading from '../components/drinks/svgs/MelonLoading';
import MilchLoading from '../components/drinks/svgs/MilchLoading';
import EspressoLoading from '../components/drinks/svgs/EspressoLoading';
import JuiceboxOrangeLoading from '../components/drinks/svgs/JuiceboxOrangeLoading';
import NightStarLoading from '../components/drinks/svgs/NightStarLoading';

// Import ChocolateMilk SVGs
import ChocolateMilkActive from '../components/drinks/svgs/ChocolateMilkActive';
import ChocolateMilkPassive from '../components/drinks/svgs/ChocolateMilkPassive';
import ChocolateMilkLoading from '../components/drinks/svgs/ChocolateMilkLoading';

export interface DrinkDefinition {
  id: string;
  name: string;
  displayName: string;
  activeSvg: React.ReactNode;
  passiveSvg: React.ReactNode;
  loadingSvg: React.ReactNode; // NEW: Loading state SVG
  sleepTimer?: {
    enabled: boolean;
    durationMinutes: number;
  };
}

// Drink Registry - Now using authentic Figma SVGs for all drinks
export const DRINK_REGISTRY: DrinkDefinition[] = [
  {
    id: 'juicebox',
    name: 'juicebox',
    displayName: 'Juicebox',
    activeSvg: <JuiceboxActive />,
    passiveSvg: <JuiceboxPassive />,
    loadingSvg: <JuiceboxLoading />
  },
  {
    id: 'martini',
    name: 'martini',
    displayName: 'Sprudel',
    activeSvg: <SprudelActive />,
    passiveSvg: <SprudelPassive />,
    loadingSvg: <SprudelLoading />
  },
  {
    id: 'sprudel',
    name: 'sprudel',
    displayName: 'Martini',
    activeSvg: <MartiniActive />,
    passiveSvg: <MartiniPassive />,
    loadingSvg: <MartiniLoading />
  },
  {
    id: 'wasser',
    name: 'wasser',
    displayName: 'Wasser',
    activeSvg: <WasserActive />,
    passiveSvg: <WasserPassive />,
    loadingSvg: <WasserLoading />
  },
  {
    id: 'coco',
    name: 'coco',
    displayName: 'Coco',
    activeSvg: <CocoActive />,
    passiveSvg: <CocoPassive />,
    loadingSvg: <CocoLoading />
  },
  {
    id: 'milkshake',
    name: 'milkshake',
    displayName: 'Milkshake',
    activeSvg: <MilkshakeActive />,
    passiveSvg: <MilkshakePassive />,
    loadingSvg: <MilkshakeLoading />
  },
  {
    id: 'bubbletea',
    name: 'bubbletea',
    displayName: 'Bubbletea',
    activeSvg: <BubbleActive />,
    passiveSvg: <BubblePassive />,
    loadingSvg: <BubbleLoading />
  },
  {
    id: 'sunrise',
    name: 'sunrise',
    displayName: 'Sunrise',
    activeSvg: <SunriseActive />,
    passiveSvg: <SunrisePassive />,
    loadingSvg: <SunriseLoading />
  },
  {
    id: 'juiceboxlichi',
    name: 'juiceboxlichi',
    displayName: 'Juicebox Lichi',
    activeSvg: <KirscheActive />,
    passiveSvg: <KirschePassive />,
    loadingSvg: <KirscheLoading />
  },
  {
    id: 'negroni',
    name: 'negroni',
    displayName: 'Negroni',
    activeSvg: <NegroniActive />,
    passiveSvg: <NegroniPassive />,
    loadingSvg: <NegroniLoading />
  },
  {
    id: 'mojito',
    name: 'mojito',
    displayName: 'Mojito',
    activeSvg: <MohitoActive />,
    passiveSvg: <MohitoPassive />,
    loadingSvg: <MohitoLoading />
  },
  {
    id: 'pinacolada',
    name: 'pinacolada',
    displayName: 'Pina Colada',
    activeSvg: <PinaActive />,
    passiveSvg: <PinaPassive />,
    loadingSvg: <PinaLoading />
  },
  {
    id: 'cola',
    name: 'cola',
    displayName: 'Cola',
    activeSvg: <ColaActive />,
    passiveSvg: <ColaPassive />,
    loadingSvg: <ColaLoading />
  },
  {
    id: 'juiceboxorange',
    name: 'juiceboxorange',
    displayName: 'Juicebox Orange',
    activeSvg: <JuiceboxOrangeActive />,
    passiveSvg: <JuiceboxOrangePassive />,
    loadingSvg: <JuiceboxOrangeLoading />
  },
  {
    id: 'manhattan',
    name: 'manhattan',
    displayName: 'Manhattan',
    activeSvg: <ManhattanActive />,
    passiveSvg: <ManhattanPassive />,
    loadingSvg: <ManhattanLoading />
  },
  {
    id: 'energydrink',
    name: 'energydrink',
    displayName: 'Energy Drink',
    activeSvg: <RedbullActive />,
    passiveSvg: <RedbullPassive />,
    loadingSvg: <RedbullLoading />
  },
  {
    id: 'macherie',
    name: 'macherie',
    displayName: 'Ma Chérie',
    activeSvg: <WeinActive />,
    passiveSvg: <WeinPassive />,
    loadingSvg: <WeinLoading />
  },
  {
    id: 'beer',
    name: 'beer',
    displayName: 'Beer',
    activeSvg: <BierActive />,
    passiveSvg: <BierPassive />,
    loadingSvg: <BierLoading />
  },
  {
    id: 'melon',
    name: 'melon',
    displayName: 'Melon',
    activeSvg: <MelonActive />,
    passiveSvg: <MelonPassive />,
    loadingSvg: <MelonLoading />
  },
  {
    id: 'espresso',
    name: 'espresso',
    displayName: 'Espresso',
    activeSvg: <EspressoActive />,
    passiveSvg: <EspressoPassive />,
    loadingSvg: <EspressoLoading />
  },
  {
    id: 'nightstar',
    name: 'nightstar',
    displayName: 'Night Star',
    activeSvg: <NightStarActive />,
    passiveSvg: <NightStarPassive />,
    loadingSvg: <NightStarLoading />,
    sleepTimer: {
      enabled: true,
      durationMinutes: 33
    }
  },
  {
    id: 'chocolatemilk',
    name: 'chocolatemilk',
    displayName: 'Chocolate Milk',
    activeSvg: <ChocolateMilkActive />,
    passiveSvg: <ChocolateMilkPassive />,
    loadingSvg: <ChocolateMilkLoading />
  },
  {
    id: 'whisky',
    name: 'whisky',
    displayName: 'Milk & Honey',
    activeSvg: <MilchActive />,
    passiveSvg: <MilchPassive />,
    loadingSvg: <MilchLoading />
  },
  {
    id: 'milkandhoney',
    name: 'milkandhoney',
    displayName: 'Whisky',
    activeSvg: <WhiskyActive />,
    passiveSvg: <WhiskyPassive />,
    loadingSvg: <WhiskyLoading />
  }
];

// Helper function to get a drink by ID
export function getDrinkById(id: string): DrinkDefinition | undefined {
  return DRINK_REGISTRY.find(drink => drink.id === id);
}

// Helper function to get drink index
export function getDrinkIndex(id: string): number {
  return DRINK_REGISTRY.findIndex(drink => drink.id === id);
}

// Helper to get station config for a drink
export function getDrinkStationConfig(drinkId: string) {
  return getStationConfig(drinkId);
}