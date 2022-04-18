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
      ssl:
        this.config.get("NODE_ENV") === "production"
          ? { rejectUnauthorized: false }
          : false,
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

  getOne<T>(r: QueryResult<T>): T {
    if (r.rows.length !== 1) {
      throw new Error(
        `Could not get one element from result: ${JSON.stringify(r)}`
      );
    }

    return r.rows[0];
  }
}
