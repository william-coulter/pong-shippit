import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PlayersService } from "../players/players.service";
import { GamesService } from "./games.service";
import { GameCreateDto } from "./interfaces/game-create.interface";

@Controller("games")
export class GamesController {
  constructor(
    private readonly playerService: PlayersService,
    private readonly gamesService: GamesService
  ) {}

  @Post("create")
  async create(@Body() dto: GameCreateDto): Promise<void> {
    const { player1, player1Score, player2, player2Score } = dto;

    if (player1Score === player2Score) {
      throw new HttpException(`Scores cannot be equal`, HttpStatus.BAD_REQUEST);
    }

    if (!(await this.playerService.isPlayer(player1))) {
      throw new HttpException(
        `Player '${player1}' is not a registered player`,
        HttpStatus.BAD_REQUEST
      );
    }

    if (!(await this.playerService.isPlayer(player2))) {
      throw new HttpException(
        `Player '${player2}' is not a registered player`,
        HttpStatus.BAD_REQUEST
      );
    }

    const winnerName = player1Score > player2Score ? player1 : player2;
    const winningScore = winnerName === player1 ? player1Score : player2Score;
    const loserName = winnerName === player1 ? player2 : player1;
    const losingScore = loserName === player1 ? player1Score : player2Score;

    await this.gamesService.create({
      winnerName,
      winningScore,
      loserName,
      losingScore,
    });
  }
}
