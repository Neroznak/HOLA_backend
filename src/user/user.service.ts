import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { hash } from "argon2";
import { AuthDto } from "../auth/dto/auth.dto";
import { MailDto } from "../auth/dto/mail.dto";


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

  async getByPhoneNumber(phoneNumber: string) {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber: phoneNumber }
    });
    return user;
  }


  async create(dto: AuthDto) {
    return this.prisma.user.create({
      data: {
        phoneNumber: dto.phoneNumber,
        email: dto.email,
        password: await hash(dto.password)
      }
    });
  }



  async addEmail(phoneNumber: string, mail: MailDto) {
    const {email } = mail;
    return this.prisma.user.update({
      where: {
        phoneNumber: phoneNumber
      },
      data: {
        email: email
      }
    });
  }

  async resetPassword (phoneNumber: string) {
    return this.prisma.user.update({
      where: {
        phoneNumber: phoneNumber
      },
      data: {
        password: null
      }
    });
  }

  async changePassword (phoneNumber: string, password:string) {
    return this.prisma.user.update({
      where: {
        phoneNumber: phoneNumber
      },
      data: {
        password: password
      }
    });
  }

  async changeIs2Fa (phoneNumber: string) {
    return this.prisma.user.update({
      where: {
        phoneNumber: phoneNumber
      },
      data: {
        is2Fa: true
      }
    });
  }
}