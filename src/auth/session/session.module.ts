import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { SessionService } from './session.service';

@Module({
  providers: [
    {
      provide: 'PG_POOL',
      useFactory: () => {
        return new Pool({
          connectionString: process.env.DATABASE_URL, // Используем DATABASE_URL
        });
      },
    },
    SessionService,
  ],
  exports: [SessionService, 'PG_POOL'],
})
export class SessionModule {}
