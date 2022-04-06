import { Module } from "@nestjs/common";
import { DbModule } from "src/services/db/db.module";
import { PlayersController } from "./players.controller";
import { PlayersService } from "./players.service";

@Module({
  imports: [DbModule],
  providers: [PlayersService],
  exports: [PlayersService],
  controllers: [PlayersController],
})
export class PlayersModule {}
