import { Injectable } from "@nestjs/common";

@Injectable()
export class EloService {
  defaultElo(): number {
    return 1200;
  }

  private calculateEloChanges(
    player1Elo: number,
    player2Elo: number
    // player1TotalGames:
  ): { newElo1: number; newElo2: number } {
    // STARTHERE: https://en.wikipedia.org/wiki/Elo_rating_system#:~:text=Supposing%20player%C2%A0A,player%27s%20rating%20is
    return { newElo1: 1200, newElo2: 1200 };
  }
}
