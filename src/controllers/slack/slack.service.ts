import { Injectable } from "@nestjs/common";
import { GamesService } from "src/controllers/games/games.service";
import { PlayersService } from "src/controllers/players/players.service";
import { Mention, SlackEvent } from "./interfaces/events.interface";
import { MentionCommand } from "./interfaces/mention-command.interface";

@Injectable()
export class SlackService {
  constructor(
    private readonly gamesService: GamesService,
    private readonly playersService: PlayersService
  ) {}

  public async handleEvent(e: SlackEvent): Promise<string> {
    switch (e.type) {
      case "app_mention":
        return this.handleMention(e);

      default:
        throw new Error(`Unrecognised Slack event: ${e.type}`);
    }
  }

  private async handleMention(e: Mention): Promise<string> {
    let command: MentionCommand;
    try {
      command = this.parseMentionText(e.text);
    } catch (e) {
      throw new Error(`Unrecognised mention: ${e}`);
    }

    try {
      return await this.handleMentionCommand(command);
    } catch (e) {
      throw new Error(`Could not ${command.command}: ${e}`);
    }
  }

  private parseMentionText(t: string): MentionCommand {
    const words = t.split(" ");

    switch (words[1]) {
      case "player":
        return { command: "create player", name: words[2] };

      case "game":
        return {
          command: "create game",
          player1: words[2],
          player1Score: parseInt(words[3], 10),
          player2: words[4],
          player2Score: parseInt(words[5], 10),
        };

      case "leaderboard":
        return { command: "get leaderboard" };

      default:
        throw new Error(`'${words[1]}' is not a command`);
    }
  }

  private async handleMentionCommand(c: MentionCommand): Promise<string> {
    switch (c.command) {
      case "create player":
        await this.playersService.create(c.name);
        return `Player created: ${c.name}`;

      case "create game":
        const { command, ...rest } = c;
        await this.gamesService.create({ ...rest });
        return (await this.playersService.getLeaderboard()).join("\n");

      case "get leaderboard":
        return (await this.playersService.getLeaderboard()).join("\n");
    }
  }
}
