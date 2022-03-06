import { Controller, Post } from "@nestjs/common";

@Controller("games")
export class GamesController {
  constructor() {}

  @Post("create")
  create(): string {
    return "This endpoint creates a played game";
  }
}
