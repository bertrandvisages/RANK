export function validateCredentials(username: string, password: string): boolean {
  // Assurons-nous que les identifiants sont insensibles à la casse
  return username.toLowerCase() === 'bertrand' && password === 'BL';
}