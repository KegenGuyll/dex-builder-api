import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeckModule } from './deck/deck.module';

@Module({
  imports: [DeckModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
