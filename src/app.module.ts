import { Module } from '@nestjs/common';
import { GamesController } from './controllers/games/games.controller';
import { PlayersController } from './controllers/players/players.controller';

@Module({
  imports: [],
  controllers: [PlayersController, GamesController],
  providers: [],
})
export class AppModule {}
