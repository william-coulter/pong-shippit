import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Request } from "express";
import { Observable } from "rxjs";

import { Config } from "src/services/config/config.interface";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService<Config>) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request): boolean {
    const maybeKey = this.extractKey(request.headers);
    if (!maybeKey) {
      return false;
    }

    console.log(`validating ${maybeKey} against ${this.config.get("API_KEY")}`);
    return maybeKey === this.config.get("API_KEY");
  }

  private extractKey(hs: {
    [key: string]: string | string[];
  }): string | undefined {
    return hs["x-api-key"] as string | undefined;
  }
}
