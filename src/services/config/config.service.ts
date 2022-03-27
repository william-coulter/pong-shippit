import { Injectable } from "@nestjs/common";
import { Config } from "./config.interface";

@Injectable()
export class ConfigService {
  get(): Config {
    return {
      ENV: process.env.ENV,
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_DATABASE: process.env.DB_DATABASE,
      DB_PASSWORD: process.env.DB_PASSWORD,
    };
  }
}
