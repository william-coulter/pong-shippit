import { Injectable } from "@nestjs/common";
import { DbService } from "src/services/db/db.service";
import { GameCreateDto } from "./interfaces/game-create.interface";

@Injectable()
export class GamesService {
  constructor(private readonly db: DbService) {}

  async create({
    player1,
    player2,
    player1Score,
    player2Score,
  }: GameCreateDto): Promise<void> {
    const SQL = `
      INSERT INTO games_raw (player1, player2, player1_score, player2_score)
      VALUES ($1, $2, $3, $4)`;

    await this.db.query(SQL, [player1, player2, player1Score, player2Score]);
  }
}
