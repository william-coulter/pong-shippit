import { Injectable, OnModuleInit } from "@nestjs/common";
import { Pool, QueryResult, QueryResultRow } from "pg";

@Injectable()
export class DbService implements OnModuleInit {
  private pool: Pool;

  async onModuleInit() {
    this.pool = new Pool({
      host: "localhost",
      user: "pong",
      database: "pong",
      password: "pong",
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
