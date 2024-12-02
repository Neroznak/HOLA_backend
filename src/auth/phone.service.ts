import Twilio from "twilio";
import { ConfigService } from "@nestjs/config";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PhoneDto } from "./dto/phone.dto";

@Injectable()
export class PhoneAuthService {
  private readonly client: Twilio.Twilio;
  private readonly serviceSid: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>("TWILIO_ACCOUNT_SID");
    const authToken = this.configService.get<string>("TWILIO_AUTH_TOKEN");
    this.serviceSid = this.configService.get<string>("TWILIO_SERVICE_SID");

    if (!accountSid || !authToken || !this.serviceSid) {
      throw new BadRequestException("Twilio credentials are not properly configured");
    }

    this.client = Twilio(accountSid, authToken);
  }

  async sendVerificationCode(phone: PhoneDto) {
    const { phoneNumber } = phone;
    try {
      const verification = await this.client.verify.v2
        .services(this.serviceSid)
        .verifications.create({
          to: phoneNumber,
          channel: "sms",
        });
      return verification.status;
    } catch (error) {
      console.error("Twilio error:", error);
      throw new BadRequestException(error.message || "Unknown Twilio error");
    }
  }

  async checkVerificationCode(phone: PhoneDto, code: string) {
    const { phoneNumber } = phone;
    try {
      const verificationCheck = await this.client.verify.v2
        .services(this.serviceSid)
        .verificationChecks.create({
          to: phoneNumber,
          code,
        });

      if (verificationCheck.status === "approved") {
        return { phoneNumber, status: true };
      } else {
        throw new BadRequestException("Invalid or expired code");
      }
    } catch (error) {
      throw new BadRequestException(
        error.message || "An error occurred during verification"
      );
    }
  }
}
