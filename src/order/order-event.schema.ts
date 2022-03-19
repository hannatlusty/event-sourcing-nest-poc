import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OrderEventType, OrderStatus } from './types';

export type OrderDocument = OrderEvent & Document;

@Schema()
export class OrderEvent {
  @Prop({ required: true })
  name: OrderEventType;

  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  issuerId: string;

  @Prop({ required: true })
  created: number;

  @Prop({ required: true })
  updated: number;

  @Prop({ required: false })
  quantity?: number;

  @Prop({ required: true })
  orderId: string;
}

export const OrderEventSchema = SchemaFactory.createForClass(OrderEvent);
