import type { Domain, Keyword } from '../../types';

const STORAGE_KEYS = {
  DOMAINS: 'domains',
  KEYWORDS: 'keywords',
  USER: 'user'
} as const;

function serializeDates<T>(obj: T): T {
  if (obj instanceof Date) {
    return obj.toISOString() as any;
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeDates) as any;
  }
  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeDates(value);
    }
    return result;
  }
  return obj;
}

function deserializeDates<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(deserializeDates) as any;
  }
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      result[key] = new Date(value);
    } else if (value && typeof value === 'object') {
      result[key] = deserializeDates(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export class LocalStorageService {
  static getDomains(): Domain[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOMAINS);
      return data ? deserializeDates(JSON.parse(data)) : [];
    } catch (error) {
      console.error('Error reading domains from localStorage:', error);
      return [];
    }
  }

  static saveDomains(domains: Domain[]) {
    try {
      const serialized = serializeDates(domains);
      localStorage.setItem(STORAGE_KEYS.DOMAINS, JSON.stringify(serialized));
    } catch (error) {
      console.error('Error saving domains to localStorage:', error);
    }
  }

  static getKeywords(): Keyword[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.KEYWORDS);
      return data ? deserializeDates(JSON.parse(data)) : [];
    } catch (error) {
      console.error('Error reading keywords from localStorage:', error);
      return [];
    }
  }

  static saveKeywords(keywords: Keyword[]) {
    try {
      const serialized = serializeDates(keywords);
      localStorage.setItem(STORAGE_KEYS.KEYWORDS, JSON.stringify(serialized));
    } catch (error) {
      console.error('Error saving keywords to localStorage:', error);
    }
  }

  static getUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? deserializeDates(JSON.parse(data)) : null;
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
      return null;
    }
  }

  static saveUser(user: any) {
    try {
      const serialized = serializeDates(user);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(serialized));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }

  static clearUser() {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error clearing user from localStorage:', error);
    }
  }

  static clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEYS.DOMAINS);
      localStorage.removeItem(STORAGE_KEYS.KEYWORDS);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error clearing all data from localStorage:', error);
    }
  }
}