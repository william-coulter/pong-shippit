import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GamesService } from "src/controllers/games/games.service";
import { PlayersService } from "src/controllers/players/players.service";
import { Config } from "src/services/config/config.interface";
import { Mention, SlackEvent } from "./interfaces/events.interface";
import { MentionCommand } from "./interfaces/mention-command.interface";
import { ILeaderboardEntry } from "src/controllers/players/interfaces/leaderboard.interface";

import fetch, { Headers } from "node-fetch";

@Injectable()
export class SlackService {
  constructor(
    private readonly gamesService: GamesService,
    private readonly playersService: PlayersService,
    private readonly configService: ConfigService<Config>
  ) {}

  public async handleEvent(e: SlackEvent): Promise<string> {
    switch (e.type) {
      case "app_mention":
        return this.handleMention(e);

      default:
        throw new Error(`Unrecognised Slack event: ${e.type}`);
    }
  }

  public async postMessage(channel: string, message: string): Promise<void> {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${this.configService.get("SLACK_APP_OAUTH_TOKEN")}`
    );
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      channel,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: message,
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    try {
      await fetch("https://slack.com/api/chat.postMessage", requestOptions);
    } catch (e) {
      throw new Error(`Could not post message: ${e}`);
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
        return this.leaderboardToString(
          await this.playersService.getLeaderboard()
        );

      case "get leaderboard":
        return this.leaderboardToString(
          await this.playersService.getLeaderboard()
        );
    }
  }

  private leaderboardToString(ls: ILeaderboardEntry[]): string {
    if (ls.length === 0) {
      return "No games played in this tournament";
    }

    const PADDING = 7;

    const header = `| ${Object.keys(ls[0])
      .map((k) => ` ${k.padEnd(PADDING, " ")}`)
      .join("|")}|`;

    const data = ls
      .map(
        (l) =>
          `| ${Object.keys(l)
            .map((k) => ` ${String(l[k]).padEnd(PADDING, " ")}`)
            .join("|")}|`
      )
      .join("\n");

    return `${header}\n${data}`;
  }
}
