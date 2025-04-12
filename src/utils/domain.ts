export function formatDomainUrl(url: string): string {
  // Nettoie et normalise l'URL du domaine
  return url.toLowerCase().trim()
    .replace(/^https?:\/\//i, '')  // Supprime http:// ou https://
    .replace(/^www\./i, '')        // Supprime www.
    .replace(/\/.*$/, '');         // Supprime tout ce qui suit le domaine
}

// Cette fonction ne fait plus de validation, elle retourne toujours true
export function validateDomainUrl(url: string): boolean {
  return true;
}