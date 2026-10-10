/**
 * Core Type Definitions for The Advent Piazza
 */

export interface Coordinates2D {
  x: number;
  y: number;
}

export interface Coordinates3D {
  x: number;
  y: number;
  z: number;
}

export interface CameraTarget3D {
  x: number;
  y: number;
  z: number;
  lookAt: Coordinates3D;
}

export interface VignetteConfig {
  type: string;
  title: string;
  accentColor: string;
}

export interface AdventDay {
  day: number;
  dateLabel: string;
  theme: string;
  location: string;
  coordinates: Coordinates2D;
  pos3d: Coordinates3D;
  camTarget3d: CameraTarget3D;
  scripture: string;
  reflection: string;
  activity: string;
  goDeeperUrl: string;
  goDeeperLabel?: string;
  vignette: VignetteConfig;
  piazzaAwakening: string;
}

export type DayStatus = 'locked' | 'available' | 'completed';

export type QualityLevel = 'auto' | 'high' | 'medium' | 'low';

export interface LanguageInfo {
  code: string;
  name: string;
  flag: string;
}

export interface TranslationDictionary {
  [key: string]: string;
}

export interface StorageState {
  completedDays: number[];
  visitedDays: number[];
  soundEnabled: boolean;
  lang: string;
  simulatedDay: number | null;
  unlockAll: boolean;
  qualityLevel: QualityLevel;
}
