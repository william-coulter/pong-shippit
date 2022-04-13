export type MentionCommand =
  | CreatePlayer
  | CreateGame
  | GetLeaderboard
  | GetCommands;

interface CreatePlayer {
  command: "create player";
  name: string;
}

interface CreateGame {
  command: "create game";
  player1: string;
  player1Score: number;
  player2: string;
  player2Score: number;
}

interface GetLeaderboard {
  command: "get leaderboard";
}

interface GetCommands {
  command: "get commands";
}
