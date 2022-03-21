import { Model, Connection } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { OrderDocument, OrderEvent } from './order-event.schema';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class OrderService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(OrderEvent.name) private orderEventModel: Model<OrderDocument>,
    private readonly commandBus: CommandBus,
  ) {}

  async findAll(): Promise<any[]> {
    return this.orderEventModel.find().exec();
  }
}
