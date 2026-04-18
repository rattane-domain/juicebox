export interface RadioStation {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  languagecodes: string;
  votes: number;
  lastchangetime: string;
  lastchangetime_iso8601: string;
  codec: string;
  bitrate: number;
  hls: number;
  lastcheckok: number;
  lastchecktime: string;
  lastchecktime_iso8601: string;
  lastcheckoktime: string;
  lastcheckoktime_iso8601: string;
  lastlocalchecktime: string;
  clicktimestamp: string;
  clickcount: number;
  clicktrend: number;
  ssl_error: number;
  geo_lat: number;
  geo_long: number;
  has_extended_info: boolean;
}

// Legacy interface for backwards compatibility
export interface DrinkCategory {
  name: string;
  stations: string[];
  displayName: string;
}

// New drink system interfaces (exported from constants/drinks.tsx)
export interface DrinkDefinition {
  id: string;
  name: string;
  displayName: string;
  stations: string[];
  activeSvg: React.ReactNode;
  passiveSvg: React.ReactNode;
}