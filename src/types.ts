export interface Ranking {
  position: number;
  targetUrl: string;
  serpUrl?: string;
  checkedAt?: string;
}

export interface Domain {
  id: string;
  name: string;
  url: string;
  backlinks?: number;
  rank?: number;
  createdAt: Date;
}

export interface Keyword {
  id: string;
  term: string;
  domainId: string;
  createdAt: Date;
  last_checked?: Date | string;
  volume?: number;
  rankings?: Ranking[];
}

export interface RankingHistory {
  id: string;
  keywordId: string;
  position: number;
  targetUrl: string;
  serpUrl?: string;
  checkedAt: Date;
}