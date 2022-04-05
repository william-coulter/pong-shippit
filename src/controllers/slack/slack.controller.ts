import { Body, Controller, Post } from "@nestjs/common";

@Controller("slack")
export class SlackController {
  constructor() {}

  @Post("events")
  events(@Body() body: any) {
    return body.challenge;
  }
}