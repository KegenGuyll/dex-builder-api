import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BasicCard } from 'src/deck/interface/deck.interface';

export type DeckDocument = HydratedDocument<Deck>;

@Schema({ timestamps: true, versionKey: false })
export class Deck {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  cards: BasicCard[];

  @Prop({ required: true })
  userId: string;

  @Prop({ default: false })
  isPublic: boolean;
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
