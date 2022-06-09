import { Injectable } from "@nestjs/common";
import { DbService } from "src/services/db/db.service";
import { ILeaderboardEntry } from "./interfaces/leaderboard.interface";

@Injectable()
export class PlayersService {
  constructor(private readonly db: DbService) {}

  async create(name: string): Promise<void> {
    const SQL = `INSERT INTO players_raw (name) VALUES ($1)`;
    await this.db.query(SQL, [name]);
  }

  async getLeaderboard(): Promise<ILeaderboardEntry[]> {
    const SQL = `
      SELECT row_number () over (order by elo desc) rank, name, elo, games, wins, losses
        FROM leaderboard`;

    const res = await this.db.query<ILeaderboardEntry, []>(SQL, []);
    return res.rows;
  }
}
