import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import * as LocalSession from 'telegraf-session-local';

const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: '5586857398:AAFE8X3ANL5qQeJyociz2ILOdPSVXrVabCA',
    }),
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
