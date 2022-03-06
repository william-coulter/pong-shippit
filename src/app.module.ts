import { Module } from "@nestjs/common";
import { GamesModule } from "./controllers/games/games.module";
import { PlayersModule } from "./controllers/players/players.module";

@Module({
  imports: [PlayersModule, GamesModule],
})
export class AppModule {}
