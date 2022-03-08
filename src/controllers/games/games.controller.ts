import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PlayersService } from "../players/players.service";
import { GameCreateDto } from "./interfaces/game-create.interface";

@Controller("games")
export class GamesController {
  constructor(private readonly playerService: PlayersService) {}

  @Post("create")
  async create(@Body() dto: GameCreateDto): Promise<string> {
    const { player1, player1Score, player2, player2Score } = dto;

    if (!(await this.playerService.isPlayer(player1))) {
      throw new HttpException(
        `Player ${player1} is not a registered player`,
        HttpStatus.BAD_REQUEST
      );
    }

    if (!(await this.playerService.isPlayer(player2))) {
      throw new HttpException(
        `Player ${player2} is not a registered player`,
        HttpStatus.BAD_REQUEST
      );
    }

    return "This endpoint creates a played game";
  }
}
