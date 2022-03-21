import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CurrentOrder, CurrentOrderDocument } from './current-order.schema';
import { Model } from 'mongoose';
import { OrderCreatedEvent } from './events/order-created.event';
import { OrderStatus } from './types';
import { OrderConfirmedEvent } from './events/order-confirmed.event';
import { OrderClosedEvent } from './events/order-closed.event';

@Injectable()
export class CurrentOrderService {
  constructor(
    @InjectModel(CurrentOrder.name)
    private readonly currentOrderEventModel: Model<CurrentOrderDocument>,
  ) {}

  async findAll(): Promise<CurrentOrder[]> {
    return this.currentOrderEventModel.find().exec();
  }

  async create(event: OrderCreatedEvent): Promise<void> {
    const order = await this.currentOrderEventModel.create({
      orderId: event.orderId,
      created: event.created,
      updated: event.updated,
      customerId: event.customerId,
      quantity: event.quantity,
      lastIssuerId: event.issuerId,
      status: OrderStatus.New,
    });

    await order.save();
  }

  async confirm(event: OrderConfirmedEvent): Promise<void> {
    const order = await this.currentOrderEventModel.findOne({
      orderId: event.orderId,
    });

    if (!order) {
      throw new NotFoundException();
    }

    order.lastIssuerId = event.issuerId;
    order.updated = event.updated;
    order.status = OrderStatus.Confirmed;

    await order.save();
  }

  async close(event: OrderClosedEvent): Promise<void> {
    const order = await this.currentOrderEventModel.findOne({
      orderId: event.orderId,
    });

    if (!order) {
      throw new NotFoundException();
    }

    order.lastIssuerId = event.issuerId;
    order.updated = event.updated;
    order.status = OrderStatus.Closed;

    await order.save();
  }
}
