import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { SlackAuthGuard } from "src/guards/slack-auth.guard";
import { SlackEventDto } from "./interfaces/events.interface";
import { SlackService } from "./slack.service";

@Controller("slack")
@UseGuards(SlackAuthGuard)
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post("events")
  async events(@Req() req, @Body() dto: SlackEventDto) {
    const { event } = dto;

    console.log(req);
    console.log("X-Slack-Retry-Num", req.headers["X-Slack-Retry-Num"]);
    console.log("X-Slack-Retry-Reason", req.headers["X-Slack-Retry-Reason"]);

    try {
      if (!event) {
        throw new Error(
          `No event in payload from Slack: ${JSON.stringify(dto)}`
        );
      }

      const message = await this.slackService.handleEvent(event);
      return await this.slackService.postMessage(event.channel, message);
    } catch (e) {
      return await this.slackService.postMessage(
        event.channel,
        `*Error*\n>${e}`
      );
    }
  }
}
