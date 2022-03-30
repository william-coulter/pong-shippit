import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { GamesService } from "./games.service";
import { GameCreateDto } from "./interfaces/game-create.interface";

@Controller("games")
@UseGuards(AuthGuard)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post("create")
  async create(@Body() dto: GameCreateDto): Promise<void> {
    await this.gamesService.create(dto);
  }
}
