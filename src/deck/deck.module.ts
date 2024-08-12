import { Module } from '@nestjs/common';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Deck, DeckSchema } from 'src/schemas/deck.schema';
import { FirebaseAdmin } from 'config/firebase.setup';
import { CardModule } from 'src/card/card.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
    CardModule,
  ],
  controllers: [DeckController],
  providers: [DeckService, FirebaseAdmin],
})
export class DeckModule {}
