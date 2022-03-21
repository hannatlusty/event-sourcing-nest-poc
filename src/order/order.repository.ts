import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { OrderDocument, OrderEvent } from './order-event.schema';
import { Injectable } from '@nestjs/common';
import { OrderCreatedEvent } from './events/order-created.event';
import { EventPublisher } from '@nestjs/cqrs';
import { OrderAggregate } from './order.aggregate';
import { OrderConfirmedEvent } from './events/order-confirmed.event';
import { OrderEventType } from './types';
import { OrderClosedEvent } from './events/order-closed.event';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(OrderEvent.name) private orderEventModel: Model<OrderDocument>,
    private readonly publisher: EventPublisher,
  ) {}

  async save(aggregate: OrderAggregate): Promise<void> {
    const events = aggregate.getUncommittedEvents() as (
      | OrderCreatedEvent
      | OrderConfirmedEvent
    )[];

    const schemas = await Promise.all(
      events.map((event) =>
        this.orderEventModel.create({
          quantity: (event as any).quantity, // todo: strict typing there
          customerId: (event as any).customerId,
          issuerId: event.issuerId,
          orderId: event.orderId,
          name: this.getEventName(event),
          updated: event.updated,
          created: event.created,
        }),
      ),
    );

    await this.orderEventModel.bulkSave(schemas);

    aggregate.commit();
  }

  private getEventName(
    event: OrderCreatedEvent | OrderConfirmedEvent,
  ): OrderEventType {
    console.log({ event });

    if (event instanceof OrderCreatedEvent) {
      return OrderEventType.CreateOrder;
    }

    return OrderEventType.ConfirmOrder;
  }

  async create(): Promise<OrderAggregate> {
    const aggregate = new OrderAggregate(Date.now().toString());

    return this.publisher.mergeObjectContext(aggregate);
  }

  async findById(orderId: string): Promise<OrderAggregate> {
    const events = await this.orderEventModel.find({ orderId }).exec();
    const aggregate = new OrderAggregate(orderId);

    aggregate.loadFromHistory(events.map(OrderRepository.mapEvent));

    return this.publisher.mergeObjectContext(aggregate);
  }

  private static mapEvent(
    orderEvent: OrderEvent,
  ): OrderConfirmedEvent | OrderCreatedEvent {
    switch (orderEvent.name) {
      case OrderEventType.ConfirmOrder:
        return new OrderConfirmedEvent(
          orderEvent.orderId,
          orderEvent.issuerId,
          orderEvent.customerId,
          orderEvent.created,
          orderEvent.updated,
        );
      case OrderEventType.CreateOrder:
        return new OrderCreatedEvent(
          orderEvent.orderId,
          orderEvent.customerId,
          orderEvent.quantity,
          orderEvent.created,
          orderEvent.updated,
          orderEvent.issuerId,
          (orderEvent as any).products,
        );
      case OrderEventType.CloseOrder:
        return new OrderClosedEvent(
          orderEvent.orderId,
          orderEvent.issuerId,
          orderEvent.customerId,
          orderEvent.created,
          orderEvent.updated,
        );
    }
  }

  async findAll(): Promise<any[]> {
    return this.orderEventModel.find().exec();
  }

  async findByQuery(query: Partial<{ id: string }>): Promise<OrderEvent> {
    return this.orderEventModel.findOne(query).exec();
  }
}
