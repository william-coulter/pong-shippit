import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Request } from "express";
import { Observable } from "rxjs";

import { Config } from "src/services/config/config.interface";

@Injectable()
export class SlackAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService<Config>) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const body = context.switchToHttp().getRequest<Request>().body;
    return this.validateRequest(body);
  }

  private validateRequest(body: any): boolean {
    const maybeToken = body.token;
    if (!maybeToken) {
      return false;
    }

    return maybeToken === this.config.get("SLACK_APP_VERIFICATION_TOKEN");
  }
}
