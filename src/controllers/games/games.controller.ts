import { Body, Controller, Post } from "@nestjs/common";
import { GamesService } from "./games.service";
import { GameCreateDto } from "./interfaces/game-create.interface";

@Controller("games")
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post("create")
  async create(@Body() dto: GameCreateDto): Promise<void> {
    await this.gamesService.create(dto);
  }
}
