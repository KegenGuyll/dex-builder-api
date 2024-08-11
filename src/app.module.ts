import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

// should be placed at the top of the file
const envModule = ConfigModule.forRoot({
  isGlobal: true,
});

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeckModule } from './deck/deck.module';

import { env } from './common/env';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    envModule,
    DeckModule,
    MongooseModule.forRoot(env.MONGO_URI),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
