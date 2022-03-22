import { Model, Connection } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { OrderDocument, OrderEvent } from './order-event.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(OrderEvent.name) private orderEventModel: Model<OrderDocument>,
  ) {}

  async findAll(query: Partial<{ orderId: string }>): Promise<OrderEvent[]> {
    return this.orderEventModel.find(query).exec();
  }
}
