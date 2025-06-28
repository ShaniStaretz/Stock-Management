import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PortfolioEntry extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 1 }) // quantity must be at least 1
  quantity: number;
  @Prop({ default: Date.now })
  addedAt: Date;
}

export const PortfolioEntrySchema =
  SchemaFactory.createForClass(PortfolioEntry);
PortfolioEntrySchema.index({ userId: 1, symbol: 1 }, { unique: true });
