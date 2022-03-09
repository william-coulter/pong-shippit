import { Module } from "@nestjs/common";
import { PrismaModule } from "src/services/prisma/prisma.module";
import { PlayersService } from "../players/players.service";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";

@Module({
  imports: [PrismaModule],
  providers: [GamesService, PlayersService],
  controllers: [GamesController],
})
export class GamesModule {}
