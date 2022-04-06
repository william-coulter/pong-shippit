import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GamesModule } from "../games/games.module";
import { PlayersModule } from "../players/players.module";
import { SlackController } from "./slack.controller";
import { SlackService } from "./slack.service";

@Module({
  imports: [GamesModule, PlayersModule, ConfigModule],
  providers: [SlackService],
  controllers: [SlackController],
})
export class SlackModule {}
