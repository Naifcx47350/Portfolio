import type { Theme } from '../hooks/useTheme';

/** URL-safe public asset path (handles spaces, &, etc.) for GitHub Pages + Vite base. */
export function publicAssetUrl(relativePath: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const encoded = relativePath.split('/').map(encodeURIComponent).join('/');
  return `${base}${encoded}`;
}

export function brandLogoUrl(theme: Theme): string {
  return publicAssetUrl(`brand/${theme}/logo-${theme}.png`);
}

export function profilePortraitUrl(theme: Theme): string {
  return publicAssetUrl(`profile/${theme}/portrait.png`);
}

export function certPdfUrl(relativePath: string): string {
  return publicAssetUrl(`Certifaction/${relativePath}`);
}
