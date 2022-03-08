import { Injectable } from "@nestjs/common";
import { Player } from "@prisma/client";
import { PrismaService } from "src/services/prisma/prisma.service";

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string): Promise<Player> {
    return this.prisma.player.create({ data: { name, elo: 1200 } });
  }

  async isPlayer(name: string): Promise<boolean> {
    return (await this.prisma.player.count({ where: { name } })) === 1;
  }
}
