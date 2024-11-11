import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { hash } from "argon2";
import { AuthDto } from "./dto/user.dto";


@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {
  }

  async getById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id }

    });
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email }
    });
    return user;
  }


  async create(dto: AuthDto) {
    return this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        passwordHash: await hash(dto.passwordHash)
      }
    });
  }
}