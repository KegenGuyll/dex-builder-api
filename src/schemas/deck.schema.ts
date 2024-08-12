import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Card } from 'src/deck/interface/deck.interface';

export type DeckDocument = HydratedDocument<Deck>;

@Schema({ timestamps: true, versionKey: false })
export class Deck {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  cards: Card[];

  @Prop({ required: true })
  userId: string;
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
