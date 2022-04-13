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

      case "commands":
        return { command: "get commands" };
    }
    throw new Error(`'${words[1]}' is not a command`);
  }

  private async handleMentionCommand(c: MentionCommand): Promise<string> {
    switch (c.command) {
      case "create player":
        await this.playersService.create(c.name);
        return `Player created: '${c.name}'. Welcome to the tournament!`;

      case "create game":
        const { command, ...rest } = c;
        const id = await this.gamesService.create({ ...rest });

        const {
          player1,
          player2,
          player1_score,
          player2_score,
          winner,
          player1_elo_change,
          player2_elo_change,
        } = await this.gamesService.get(id);

        const loser = player1 !== winner ? player1 : player2;
        const winningScore = player1 === winner ? player1_score : player2_score;
        const losingScore = player1 !== winner ? player1_score : player2_score;
        const winningEloChange =
          player1 === winner ? player1_elo_change : player2_elo_change;
        const losingEloChange =
          player1 !== winner ? player1_elo_change : player2_elo_change;

        return `${winner} ${this.getDefeatedSynonym(
          winningScore,
          losingScore
        )} ${loser} ${winningScore} to ${losingScore}
${winner} ${winningEloChange}, ${loser} ${losingEloChange}

New standings:\n${this.leaderboardToString(
          await this.playersService.getLeaderboard()
        )}`;

      case "get leaderboard":
        return this.leaderboardToString(
          await this.playersService.getLeaderboard()
        );

      case "get commands":
        return `List of available commands:
- Add player to tournament: \`@pong player <NAME>\`
- Add a game to the tournament: \`@pong game <P1> <P1_SCORE> <P2> <P2_SCORE>\`
- View the leaderboard: \`@pong leaderboard\`
- List available commands: \`@pong commands\``;
    }
  }

  private getDefeatedSynonym(
    winningScore: number,
    losingScore: number
  ): string {
    const difference = winningScore - losingScore;
    const ratio = difference / winningScore;

    if (ratio > 0.8) {
      return "utterly demolished";
    } else if (ratio > 0.6) {
      return "confidently beat";
    } else if (ratio > 0.5) {
      return "had a smooth win against";
    } else if (ratio > 0.3) {
      return "defeated";
    } else if (ratio > 0.2) {
      return "just beat";
    } else if (ratio > 0.1) {
      return "narrowly won against";
    } else {
      return "swindled a win against";
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

    return `\`\`\`${header}\n${data}\`\`\``;
  }
}
