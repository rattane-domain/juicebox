// Direct stream URLs for maximum reliability
// Each drink has a primary stream URL and fallback search terms
export interface StationConfig {
  id: string;
  name: string;
  primaryUrl: string;
  fallbackSearchTerms: string[];
  description: string;
}

export const STATION_CONFIGS: StationConfig[] = [
  {
    id: 'chocolatemilk',
    name: 'Music Nation',
    primaryUrl: 'https://stream.zeno.fm/bcynpkcznv8uv',
    fallbackSearchTerms: ['Music Nation', 'music nation'],
    description: 'Music Nation live stream'
  },
  {
    id: 'juicebox',
    name: 'Groove Salad',
    primaryUrl: 'https://ice1.somafm.com/groovesalad-256-mp3',
    fallbackSearchTerms: ['groove salad', 'SomaFM'],
    description: 'Downtempo ambient groove'
  },
  {
    id: 'martini',
    name: 'FIP',
    primaryUrl: 'https://icecast.radiofrance.fr/fip-hifi.aac',
    fallbackSearchTerms: ['FIP', 'Radio France'],
    description: 'French eclectic music'
  },
  {
    id: 'sprudel',
    name: 'Gri Balkon',
    primaryUrl: 'https://gribalkon.radioca.st/stream',
    fallbackSearchTerms: ['gri balkon', 'gri', 'balkon'],
    description: 'Alternative music station'
  },
  {
    id: 'wasser',
    name: 'Deep Space One',
    primaryUrl: 'https://ice2.somafm.com/deepspaceone-128-mp3',
    fallbackSearchTerms: ['Deep Space One', 'SomaFM'],
    description: 'Deep ambient space music'
  },
  {
    id: 'sunrise',
    name: 'Ibiza Sonica',
    primaryUrl: 'https://ibizasonica.streaming-pro.com:8000/ibizasonica',
    fallbackSearchTerms: ['Ibiza Sonica', 'sonica'],
    description: 'Balearic house and chill'
  },
  {
    id: 'juiceboxlichi',
    name: 'Rinse France',
    primaryUrl: 'https://radio10.pro-fhi.net/radio/9041/stream',
    fallbackSearchTerms: ['Rinse France', 'rinse'],
    description: 'French underground music'
  },
  {
    id: 'negroni',
    name: 'Dublab',
    primaryUrl: 'https://dublab.out.airtime.pro/dublab_a',
    fallbackSearchTerms: ['dublab', 'dub lab'],
    description: 'Future music from Los Angeles'
  },
  {
    id: 'milkshake',
    name: 'Radio Paradise',
    primaryUrl: 'https://stream.radioparadise.com/aac-320',
    fallbackSearchTerms: ['radio paradise', 'paradise'],
    description: 'Commercial-free rock mix'
  },
  {
    id: 'mojito',
    name: 'Byte FM',
    primaryUrl: 'https://bytefm.stream39.radiohost.de/bytefm-main_mp3-128?addradio=&upd-meta=0&upd-scheme=https&_art=dD0xNzU0MTQ3Nzc1JmQ9MDUwNDc4MWNhZjc3Mzk4MTcxNTM',
    fallbackSearchTerms: ['Byte FM', 'ByteFM'],
    description: 'German alternative music'
  },
  {
    id: 'pinacolada',
    name: 'Los 40 Urban',
    primaryUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_URBAN.mp3',
    fallbackSearchTerms: ['Los 40 Urban', 'los 40'],
    description: 'Urban Latin music'
  },
  {
    id: 'cola',
    name: 'CAVIAR Radio',
    primaryUrl: 'https://caviar-radio.radiocult.fm/stream',
    fallbackSearchTerms: ['CAVIAR Radio', 'caviar', 'radiocult'],
    description: 'CAVIAR Radio live stream'
  },
  {
    id: 'juiceboxorange',
    name: 'Ibiza SoniCalm',
    primaryUrl: 'https://ibizasonica.streaming-pro.com:8014/sonicalm',
    fallbackSearchTerms: ['Ibiza SoniCalm', 'sonicalm'],
    description: 'Calm and relaxing music'
  },
  {
    id: 'manhattan',
    name: 'Frisky deep',
    primaryUrl: 'http://deep.friskyradio.com/friskydeep_aachi',
    fallbackSearchTerms: ['Frisky deep', 'frisky'],
    description: 'Deep house and progressive'
  },
  {
    id: 'bubbletea',
    name: 'The Beat',
    primaryUrl: 'https://listen.181fm.com/181-beat_128k.mp3',
    fallbackSearchTerms: ['The Beat', 'beat radio'],
    description: 'Contemporary hit music'
  },
  {
    id: 'energydrink',
    name: 'George FM',
    primaryUrl: 'https://mediaworks.streamguys1.com/george_net_icy',
    fallbackSearchTerms: ['george FM', 'george'],
    description: 'New Zealand dance music'
  },
  {
    id: 'macherie',
    name: 'Fluid Radio',
    primaryUrl: 'https://uk4-vn.mixstream.net/:9270/listen.mp3',
    fallbackSearchTerms: ['Fluid Radio', 'Fluid'],
    description: 'Experimental ambient and electroacoustic'
  },
  {
    id: 'beer',
    name: 'Idobi',
    primaryUrl: 'https://idobi-live-a.cdnstream1.com/10723_128.mp3',
    fallbackSearchTerms: ['Idobi', 'idobi radio'],
    description: 'Alternative rock and pop punk'
  },
  {
    id: 'melon',
    name: 'Fip : Reggae',
    primaryUrl: 'https://icecast.radiofrance.fr/fipreggae-midfi.mp3',
    fallbackSearchTerms: ['Radio Vinyle', 'FIP reggae'],
    description: 'Reggae and world music'
  },
  {
    id: 'espresso',
    name: 'Evosonic',
    primaryUrl: 'https://stream.evosonic.de/',
    fallbackSearchTerms: ['Evosonic', 'evo sonic'],
    description: 'Progressive electronic'
  },
  {
    id: 'whisky',
    name: 'Lofi Girl',
    primaryUrl: 'https://play.streamafrica.net/lofiradio',
    fallbackSearchTerms: ['Lofi Girl', 'lofi', 'chillhop'],
    description: 'Lo-fi hip hop beats'
  },
  {
    id: 'coco',
    name: 'Lusophonica',
    primaryUrl: 'https://stream.radiojar.com/dxkmh6hv1f8uv?1651072328',
    fallbackSearchTerms: ['lusophonica', 'radio lusophonica', 'lusofonica'],
    description: 'Portuguese and Lusophone music'
  },
  {
    id: 'milkandhoney',
    name: 'Ambient Sleeping Pill',
    primaryUrl: 'https://radio.stereoscenic.com/asp-s',
    fallbackSearchTerms: ['Ambient Sleeping Pill', 'ambient sleep'],
    description: 'Peaceful ambient for relaxation'
  },
  {
    id: 'nightstar',
    name: 'SF in SF',
    primaryUrl: 'https://ice6.somafm.com/sfinsf-128-mp3',
    fallbackSearchTerms: ['SF in SF', 'SomaFM', 'san francisco'],
    description: 'Music from San Francisco artists'
  }
];

// Helper to get station config by drink ID
export function getStationConfig(drinkId: string): StationConfig | undefined {
  return STATION_CONFIGS.find(config => config.id === drinkId);
}