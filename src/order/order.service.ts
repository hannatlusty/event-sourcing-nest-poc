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

  // async createOrder(createOrderDto: Types) {
  //   return this.commandBus.execute(
  //     new CreateOrderCommand(
  //       createOrderDto.quantity,
  //       createOrderDto.customerId,
  //     ),
  //   );
  // }
  //
  // async confirmOrder(confirmOrderDto: ConfirmOrderDto): Promise<void> {
  //   return this.commandBus.execute(new ConfirmOrderCommand(closeOrderDto.id));
  // }

  // async closeOrder(closeOrderDto: CloseOrderDto): Promise<void> {
  //   return this.commandBus.execute(new CloseOrderCommand(closeOrderDto.id));
  // }

  async findAll(): Promise<any[]> {
    return this.orderEventModel.find().exec();
  }
}
