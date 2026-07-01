import type { Theme } from '../hooks/useTheme';

export interface LatentCluster {
  /** Real project this cluster represents. */
  name: string;
  /** Centroid in a normalized [-1, 1] design space. */
  center: [number, number];
  /** Relative share of the total particle budget. */
  weight: number;
  /** Hex color per theme — dark: red punctuation; light: sky blue / navy / magenta facets. */
  dark: string;
  light: string;
}

/**
 * Each cluster is one of Naif's real projects. Particles bloom from these
 * centroids, so the drifting cloud is a loose "latent space" portrait of the work.
 */
export const latentClusters: LatentCluster[] = [
  { name: 'HafidhAI', center: [-0.49, 0.29], weight: 1.0, dark: '#E0322B', light: '#8ECBF5' },
  { name: 'TerraMind', center: [0.5, 0.35], weight: 1.0, dark: '#F2F2F4', light: '#A8BFD4' },
  { name: 'HydroAI', center: [-0.39, -0.35], weight: 0.95, dark: '#A1A1A6', light: '#B8DEFF' },
  { name: 'Naskh', center: [0.42, -0.29], weight: 0.95, dark: '#8B1A16', light: '#E8B4D8' },
];

export function clusterColors(theme: Theme): [number, number, number][] {
  return latentClusters.map((c) => hexToRgb01(theme === 'dark' ? c.dark : c.light));
}

export function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return [r, g, b];
}
