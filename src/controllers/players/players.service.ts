import { Injectable } from "@nestjs/common";
import { DbService } from "src/services/db/db.service";

@Injectable()
export class PlayersService {
  constructor(private readonly db: DbService) {}

  async create(name: string): Promise<void> {
    const SQL = `INSERT INTO players_raw (name) VALUES ($1)`;
    const res = await this.db.query(SQL, [name]);
  }

  async getLeaderboard(): Promise<ILeaderboardEntry[]> {
    const SQL = `
      SELECT name, elo, games, wins, losses
        FROM leaderboard
        FETCH FIRST 10 ROWS ONLY;`;

    const res = await this.db.query<ILeaderboardEntry, []>(SQL, []);
    return res.rows;
  }
}
