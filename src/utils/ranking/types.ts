export interface RankingRequest {
  keyword: string;
  domain: string;
  username: string;
}

export interface RankingResponse {
  position: number;
  targetUrl: string;
  serpUrl?: string;
}