import { Body, Controller, Get, Post } from "@nestjs/common";
import { PlayersService } from "src/controllers/players/players.service";
import { PlayerCreateDto } from "./interfaces/player-create.interface";

@Controller("players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post("create")
  create(@Body() dto: PlayerCreateDto) {
    return this.playersService.create(dto.name);
  }

  @Get("leaderboard")
  leaderBoard() {
    return this.playersService.getLeaderboard();
  }
}
