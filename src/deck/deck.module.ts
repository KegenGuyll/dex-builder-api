import { Module } from '@nestjs/common';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Deck, DeckSchema } from 'src/schemas/deck.schema';
import { FirebaseAdmin } from 'config/firebase.setup';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
  ],
  controllers: [DeckController],
  providers: [DeckService, FirebaseAdmin],
  exports: [DeckService],
})
export class DeckModule {}
