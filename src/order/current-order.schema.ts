import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderStatus } from './types';

export type CurrentOrderDocument = CurrentOrder & Document;

@Schema()
export class CurrentOrder {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  lastIssuerId: string;

  @Prop({ required: true })
  created: number;

  @Prop({ required: true })
  status: OrderStatus;

  @Prop({ required: true })
  updated: number;

  @Prop({ required: true })
  quantity: number;
}

export const CurrentOrderSchema = SchemaFactory.createForClass(CurrentOrder);
