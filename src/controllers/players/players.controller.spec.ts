import { Test, TestingModule } from "@nestjs/testing";
import { PlayersController } from "./players.controller";

describe("PlayersController", () => {
  let playersController: PlayersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [],
    }).compile();

    playersController = app.get<PlayersController>(PlayersController);
  });

  describe("root", () => {
    it('should return "Hello World!"', () => {
      expect(playersController.create()).toBe(
        "This endpoint creates a new player"
      );
    });
  });
});
