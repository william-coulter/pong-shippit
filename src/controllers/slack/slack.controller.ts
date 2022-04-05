import { Body, Controller, Post } from "@nestjs/common";
import { SlackEventDto } from "./interfaces/events.interface";

@Controller("slack")
export class SlackController {
  constructor() {}

  @Post("events")
  events(@Body() dto: SlackEventDto) {
    console.log("received body:", dto);
  }
}
