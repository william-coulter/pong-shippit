import { Module } from "@nestjs/common";
import { PrismaModule } from "src/services/prisma/prisma.module";
import { PlayersController } from "./players.controller";
import { PlayersService } from "./players.service";

@Module({
  imports: [PrismaModule],
  providers: [PlayersService],
  controllers: [PlayersController],
})
export class PlayersModule {}
