import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Card } from 'src/deck/interface/deck.interface';

export type DeckDocument = HydratedDocument<Deck>;

@Schema()
export class Deck {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  cards: Card[];
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
