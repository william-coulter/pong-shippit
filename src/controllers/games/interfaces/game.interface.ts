export interface Game {
  id: number;
  timestamp: string;
  player1: string;
  player2: string;
  player1_score: number;
  player2_score: number;
  winner: string;
  player1_elo_change: number;
  player2_elo_change: number;
}
