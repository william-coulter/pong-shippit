import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GamesModule } from "./controllers/games/games.module";
import { PlayersModule } from "./controllers/players/players.module";
import { SlackModule } from "./controllers/slack/slack.module";

const env: "production" | "local" =
  process.env.NODE_ENV === "production" ? "production" : "local";

@Module({
  imports: [
    PlayersModule,
    GamesModule,
    SlackModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env.${env}` }),
  ],
})
export class AppModule {}
