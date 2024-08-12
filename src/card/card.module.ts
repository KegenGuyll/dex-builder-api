import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TCGCardSchema, TCGCard } from 'src/schemas/card.schema';
import { CardService } from './card.service';
import { CardController } from './card.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TCGCard.name, schema: TCGCardSchema }]),
  ],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
