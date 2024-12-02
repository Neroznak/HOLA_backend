import * as nodemailer from "nodemailer";
import { BadRequestException, Injectable, Scope } from "@nestjs/common";
import { MailDto } from "./dto/mail.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import Redis from "ioredis";


@Injectable({ scope: Scope.DEFAULT }) // Singleton
export class MailAuthService {
  private transporter;
  private redis: Redis;
  private verificationCodes: Map<string, string>;


  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: this.configService.get("EMAIL_USER"),
        pass: this.configService.get("EMAIL_PASS")
      }
    });
    // this.redis = new Redis();
    this.verificationCodes = new Map();

  }

  async sendVerificationEmail(mail: MailDto) {

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10); // Хэшируем код
    const { email } = mail;
    const message = {
      from: "neroznakdn@gmail.com",
      to: email,
      subject: "Код подтверждения Hola App",
      text: `Ваш код подтверждения: ${code}`,
      html: `<p>Ваш код подтверждения: <strong>${code}</strong></p>`
    };

    try {
      await this.transporter.sendMail(message);
      // await this.redis.set(email, hashedCode, "EX", 5 * 60);
      this.verificationCodes.set(email, hashedCode);
      return true;
    } catch (error) {
      throw new BadRequestException(error.message || "Unknown SendGrid error");
    }
  }

  async verifyCode(mail: MailDto, code: string) {
    const { email } = mail;
    // const hashedCode = await this.redis.get(email);
    const hashedCode = this.verificationCodes.get(email);
    const isMatch = await bcrypt.compare(code, hashedCode);
    if (isMatch) {
      // await this.redis.del(email);
      this.verificationCodes.delete(email);
      return { email, status: true };
    } else {
      throw new BadRequestException("Invalid or expired code");
    }
  }

}





