import { Body, Controller, Post, Req } from "@nestjs/common";
import { SlackEventDto } from "./interfaces/events.interface";
import { SlackService } from "./slack.service";

@Controller("slack")
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post("events")
  async events(@Req() req, @Body() dto: SlackEventDto) {
    console.log(req);

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
        `Error!\n>${e}`
      );
    }
  }
}
