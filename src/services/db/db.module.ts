import { Module } from "@nestjs/common";
import { ConfigModule } from "../config/config.module";
import { DbService } from "./db.service";

@Module({
  providers: [DbService, ConfigModule],
  exports: [DbService],
})
export class DbModule {}
