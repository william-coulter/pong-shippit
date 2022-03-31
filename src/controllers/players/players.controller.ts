import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { PlayersService } from "src/controllers/players/players.service";
import { AuthGuard } from "src/guards/auth.guard";
import { PlayerCreateDto } from "./interfaces/player-create.interface";

@Controller("players")
@UseGuards(AuthGuard)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post("create")
  create(@Body() dto: PlayerCreateDto) {
    console.log(`Here with DTO: ${dto}`);
    return this.playersService.create(dto.name);
  }

  @Get("leaderboard")
  leaderBoard() {
    return this.playersService.getLeaderboard();
  }
}
