import { Injectable } from "@nestjs/common";
import { QueryResult } from "pg";
import { DbService } from "src/services/db/db.service";
import { GameCreateDto } from "./interfaces/game-create.interface";
import { Game } from "./interfaces/game.interface";

@Injectable()
export class GamesService {
  constructor(private readonly db: DbService) {}

  async create({
    player1,
    player2,
    player1Score,
    player2Score,
  }: GameCreateDto): Promise<number> {
    const SQL = `
      INSERT INTO games_raw (player1, player2, player1_score, player2_score)
      VALUES ($1, $2, $3, $4)
      RETURNING id`;

    return this.db
      .query<{ id: number }, [string, string, number, number]>(SQL, [
        player1,
        player2,
        player1Score,
        player2Score,
      ])
      .then(this.getOne)
      .then((x) => x.id);
  }

  async get(id: number): Promise<Game> {
    const SQL = `SELECT
      id,
      timestamp,
      winner,
      loser,
      winning_score,
      losing_score,
      winning_elo_change,
      losing_elo_change
    FROM games WHERE id = $1`;

    return this.db.query<Game, [number]>(SQL, [id]).then(this.getOne);
  }

  private getOne<T>(r: QueryResult<T>): T {
    if (r.rows.length !== 1) {
      throw new Error(
        `Could not get one element from result: ${JSON.stringify(r)}`
      );
    }

    return r.rows[0];
  }
}
