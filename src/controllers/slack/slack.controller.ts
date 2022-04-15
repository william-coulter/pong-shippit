import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { SlackAuthGuard } from "src/guards/slack-auth.guard";
import { SlackEventDto } from "./interfaces/events.interface";
import { SlackService } from "./slack.service";

@Controller("slack")
@UseGuards(SlackAuthGuard)
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post("events")
  async events(@Body() dto: SlackEventDto) {
    const { event } = dto;

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
