import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool, QueryResult, QueryResultRow } from "pg";

import { Config } from "src/services/config/config.interface";

@Injectable()
export class DbService implements OnModuleInit {
  private pool: Pool;

  constructor(private readonly config: ConfigService<Config>) {}

  async onModuleInit() {
    this.pool = new Pool({
      connectionString: this.config.get("DATABASE_URL"),
      ssl: { rejectUnauthorized: false },
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async onApplicationShutdown() {
    await this.pool.end();
  }

  async query<R extends QueryResultRow, I extends any[]>(
    sql: string,
    params: I
  ): Promise<QueryResult<R>> {
    const client = await this.pool.connect();
    const result = await client.query<R, I>(sql, params);
    client.release();
    return result;
  }
}
