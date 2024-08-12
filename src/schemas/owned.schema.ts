import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OwnedDocument = HydratedDocument<Owned>;

@Schema({ timestamps: true, versionKey: false })
export class Owned {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  cardId: string;

  @Prop({ required: true, min: 1 })
  count: number;

  @Prop()
  notes: string;

  @Prop(Date)
  updatedAt: Date; // The date the card was owned was last updated.

  @Prop(Date)
  createdAt: Date; // The date the card was owned.
}

export const OwnedSchema = SchemaFactory.createForClass(Owned);
