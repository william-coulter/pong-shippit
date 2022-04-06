import { Body, Controller, Post } from "@nestjs/common";
import { SlackEventDto } from "./interfaces/events.interface";
import { SlackService } from "./slack.service";

@Controller("slack")
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post("events")
  async events(@Body() dto: SlackEventDto) {
    const { event } = dto;

    console.log(JSON.stringify(dto));

    if (!event) {
      throw new Error(`No event in payload from Slack: ${JSON.stringify(dto)}`);
    }

    return await this.slackService.handleEvent(event);
  }
}
