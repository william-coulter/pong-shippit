import { Module } from "@nestjs/common";
import { DbModule } from "src/services/db/db.module";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";

@Module({
  imports: [DbModule],
  providers: [GamesService],
  exports: [GamesService],
  controllers: [GamesController],
})
export class GamesModule {}
