import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma/prisma.service";

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async create(name: string) {
  return this.prisma.player.create({ data: { name, elo: 1200 } });
  }
}
