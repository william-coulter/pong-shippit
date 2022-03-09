import { Injectable } from "@nestjs/common";
import { Game, Prisma } from "@prisma/client";
import { PrismaService } from "src/services/prisma/prisma.service";

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.GameUncheckedCreateInput): Promise<Game> {
    return this.prisma.game.create({ data });
    // TODO: Need to update players elos - I wonder if prisma allows me
    // to write an SQL trigger?
  }
}
