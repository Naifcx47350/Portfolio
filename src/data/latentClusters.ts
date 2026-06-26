import type { Theme } from '../hooks/useTheme';

export interface LatentCluster {
  /** Real project this cluster represents. */
  name: string;
  /** Centroid in a normalized [-1, 1] design space. */
  center: [number, number];
  /** Relative share of the total particle budget. */
  weight: number;
  /** Hex color per theme — red used as punctuation, neutrals as fill. */
  dark: string;
  light: string;
}

/**
 * Each cluster is one of Naif's real projects. Particles bloom from these
 * centroids, so the drifting cloud is a loose "latent space" portrait of the work.
 */
export const latentClusters: LatentCluster[] = [
  { name: 'HafidhAI', center: [-0.58, 0.34], weight: 1.0, dark: '#E0322B', light: '#C42820' },
  { name: 'TerraMind', center: [0.6, 0.42], weight: 1.0, dark: '#F2F2F4', light: '#3A3A3E' },
  { name: 'HydroAI', center: [-0.46, -0.42], weight: 0.95, dark: '#A1A1A6', light: '#6E6E73' },
  { name: 'Naskh', center: [0.5, -0.34], weight: 0.95, dark: '#8B1A16', light: '#7A1410' },
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
