import { Injectable } from "@nestjs/common";
import { DbService } from "src/services/db/db.service";

@Injectable()
export class PlayersService {
  constructor(private readonly db: DbService) {}

  async create(name: string): Promise<void> {
    const SQL = `INSERT INTO players_raw (name) VALUES ($1)`;
    await this.db.query(SQL, [name]);
  }
}
