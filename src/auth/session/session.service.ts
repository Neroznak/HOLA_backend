import { Injectable, Inject } from "@nestjs/common";
import { Pool } from "pg";
import { Request } from "express";
import * as useragent from "useragent";
import * as geoip from "geoip-lite";
import { PrismaService } from "../../prisma.service";


export interface cookie {
  "originalMaxAge": 3600000,
  "expires": Date,
  "httpOnly": boolean,
  "path": string;
}

export interface SessionData {
  cookie: cookie;
  id: string;
  device_name: string;
  ip_adress: string;
  location: string;
  last_active: Date;
  is_active: boolean;
  device_type: string;
  user_id: number;
  expire: Date;
  sid: string;
}

@Injectable()
export class SessionService {
  constructor(@Inject("PG_POOL") private readonly pool: Pool,
              private readonly prisma: PrismaService) {
  }

  async createSession(session: SessionData, userAgent: string, ip: string, userId: number) {
    // const agent = useragent.parse(userAgent);
    const geo = geoip.lookup(ip);
    if (geo) {
      session.location = `${geo.city}, ${geo.country}`;
    } else {
      session.location = "Unknown Location";
    }
    const result = 1;
    // try {
    //   const result = await this.prisma.session.create({
    //     data: {
    //       sid: session.id,
    //       device_name: agent.device || "Unknown Device",
    //       ip_adress: ip,
    //       location: session.location,
    //       last_active: new Date(),
    //       is_active: true,
    //       device_type: agent.os.family || "Unknown OS",
    //       user_id: userId,
    //       expire: new Date((new Date(session.cookie.expires).getTime() + session.cookie.originalMaxAge)),
    //     }
    //   });
      return result;
    // } catch (error) {
    //   console.error("Query execution error:", error);
    //   throw new Error("Failed to create session");
    // }
  }

  async upgradeSession(session: SessionData) {
    session.last_active = new Date();
    session.is_active = true;
    session.expire = new Date((new Date(session.expire).getTime() + 3600000));
    try {
      const result = await this.pool.query(
        "UPDATE session SET expire = $1, is_active = $2, last_active = $3 WHERE sid = $4",
        [session.expire, true, new Date(), session.sid]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Query execution error:", error);
      throw new Error("Failed to create session");
    }
  }

  async getSessionsById(userId: number) {

    const result = await this.pool.query(
      "SELECT * FROM session WHERE user_id = $1",
      [userId]
    );

    return result.rows; // Возвращаем данные сессии
  }

  async getActiveSession(userId: number, userAgent: string, ip: string) {
    const rows = await this.getSessionsById(userId);
    const agent = useragent.parse(userAgent);
    const device_name = JSON.stringify(agent.device || { family: "Unknown Device" });
    const result = rows.find(
      (row) =>
        row.device_name === device_name && row.ip_adress === ip
    );
    console.log(JSON.stringify(result));

    if (!result) return null; else return result;

  }

  async destroySession(req: Request) {
    const sessionId = req.session.id;

    await this.pool.query("DELETE FROM session WHERE sid = $1", [sessionId]);
    req.session.destroy((err) => {
      if (err) {
        console.error("Failed to destroy session:", err);
      }
    });
  }
}
