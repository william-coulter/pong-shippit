export interface Game {
  id: number;
  timestamp: string;
  winner: string;
  loser: string;
  winning_score: number;
  losing_score: number;
  winning_elo_change: number;
  losing_elo_change: number;
}
