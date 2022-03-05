import { Controller,  Get,  Post } from '@nestjs/common';

@Controller('players')
export class PlayersController {
  constructor() {}

  @Post('create')
  create(): string {
    return 'This endpoint creates a new player';
  }

  @Get('leader-board')
  leaderBoard(): string {
    return 'This endpoint returns the leader board'
  }
}
