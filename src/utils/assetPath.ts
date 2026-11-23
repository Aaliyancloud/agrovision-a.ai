/**
 * Bulletproof asset URL resolver that supports both root hosting (Vercel, Cloud Run)
 * and subpath hosting (GitHub Pages, e.g. /AgrovisionAI2334/).
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }

  let clean = path.trim();

  // Strip erroneous /public/ or public/ prefix
  if (clean.startsWith('/public/')) {
    clean = clean.replace('/public/', '/');
  } else if (clean.startsWith('public/')) {
    clean = clean.replace('public/', '/');
  }

  // Rewrite /src/assets/ to /assets/
  if (clean.startsWith('/src/assets/')) {
    clean = clean.replace('/src/assets/', '/assets/');
  } else if (clean.startsWith('src/assets/')) {
    clean = clean.replace('src/assets/', '/assets/');
  }

  if (!clean.startsWith('/')) {
    clean = '/' + clean;
  }

  const base =
    (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.BASE_URL : undefined) ||
    '/';
  if (base && base !== '/') {
    const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${trimmedBase}${clean}`;
  }

  return clean;
}
