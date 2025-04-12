import type { Domain, Keyword } from '../../types';

export const mockDomains: Domain[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'example.com',
    url: 'example.com',
    createdAt: new Date(),
    isFavorite: false
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'test.com',
    url: 'test.com',
    createdAt: new Date(),
    isFavorite: true
  }
];

export const mockKeywords: Keyword[] = [
  {
    id: '33333333-3333-3333-3333-333333333333',
    term: 'test keyword',
    domainId: '11111111-1111-1111-1111-111111111111',
    createdAt: new Date(),
    isFavorite: false,
    rankings: []
  }
];