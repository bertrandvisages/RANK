export class RankingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RankingError';
  }
}