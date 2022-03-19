import { AggregateRoot } from '@nestjs/cqrs';
import { OrderCreatedEvent } from './events/order-created.event';
import { OrderConfirmedEvent } from './events/order-confirmed.event';
import { OrderEvent } from './order-event.schema';
import { OrderStatus } from './types';

export class OrderAggregateOnlyCustomerCanConfirmOrder extends Error {}

export class OrderAggregate extends AggregateRoot {
  private customerId: string;
  private quantity: number;
  private status: OrderStatus = OrderStatus.New;

  get orderId(): string {
    return this.id;
  }

  constructor(private id: string) {
    super();
  }

  createOrder(order: {
    customerId: string;
    quantity: number;
    issuerId: string;
  }) {
    this.apply(
      new OrderCreatedEvent(
        this.id,
        order.customerId,
        order.quantity,
        Date.now(),
        Date.now(),
        order.issuerId,
      ),
    );
  }

  confirmOrder({ issuerId }: { issuerId: string }) {
    // Business rule: only customer himself can confirm order
    console.log(this);
    if (issuerId !== this.customerId) {
      throw new OrderAggregateOnlyCustomerCanConfirmOrder();
    }

    this.apply(
      new OrderConfirmedEvent(
        this.id,
        issuerId,
        this.customerId,
        Date.now(),
        Date.now(),
      ),
    );
  }

  private onOrderCreatedEvent(event: OrderEvent): void {
    this.customerId = event.customerId;
    this.quantity = event.quantity;
    this.status = OrderStatus.New;
  }

  private onOrderConfirmedEvent(event: OrderConfirmedEvent): void {
    this.status = OrderStatus.Confirmed;
  }
}
