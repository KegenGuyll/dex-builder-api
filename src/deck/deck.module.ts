import { Module } from '@nestjs/common';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Deck, DeckSchema } from 'src/schemas/deck.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
  ],
  controllers: [DeckController],
  providers: [DeckService],
  exports: [DeckService],
})
export class DeckModule {}
