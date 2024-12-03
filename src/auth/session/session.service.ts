import { Injectable, BadRequestException } from "@nestjs/common";
import * as useragent from "useragent";
import * as geoip from "geoip-lite";
import { PrismaService } from "../../prisma.service";

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {
  }

  async createSession(userAgent: string, ip: string, userId: number) {
    const agent = useragent.parse(userAgent);
    const geo = geoip.lookup(ip);
    const location = geo?.city || "Unknown Location"; // Если geo или geo.city null, будет использоваться "Unknown Location"
    try {
      return await this.prisma.session.create({
        data: {
          device_name: agent.device.family || "Unknown Device",
          ip_adress: ip,
          location: location,
          last_active: new Date(),
          device_type: agent.os.family || "Unknown OS",
          user_id: userId
        }
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async upgradeSession(sid: string) {
    const last_active = new Date();
    return this.prisma.session.update({
      where: {
        sid: sid
      },
      data: {
        last_active: last_active
      }
    });
  }


  async upsertSession(userId: number, userAgent: string, ip: string) {
    const agent = useragent.parse(userAgent);
    const device_name = agent.device.family;
    const activeSession = await this.prisma.session.findMany({
      where: {
        user_id: userId,
        device_name: device_name,
        ip_adress: ip
      }
    });
    if (activeSession.length === 0) {
      return this.createSession(userAgent, ip, userId);
    }
    else
    {
      return this.upgradeSession(activeSession[0].sid);
    }
  }

}
