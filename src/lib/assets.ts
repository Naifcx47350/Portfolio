/** URL-safe public asset path (handles spaces, &, etc.) for GitHub Pages + Vite base. */
export function publicAssetUrl(relativePath: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const encoded = relativePath.split('/').map(encodeURIComponent).join('/');
  return `${base}${encoded}`;
}

export function certPdfUrl(relativePath: string): string {
  return publicAssetUrl(`Certifaction/${relativePath}`);
}
