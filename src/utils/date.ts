export function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  return new Intl.DateTimeFormat('fr-FR', options).format(d);
}