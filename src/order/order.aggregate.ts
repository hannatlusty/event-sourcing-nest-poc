import { AggregateRoot } from '@nestjs/cqrs';
import { OrderCreatedEvent } from './events/order-created.event';
import { OrderConfirmedEvent } from './events/order-confirmed.event';
import { OrderStatus } from './types';
import { Product } from './product.entity';
import { OrderClosedEvent } from './events/order-closed.event';

export class OrderAggregateOnlyCustomerCanConfirmOrder extends Error {}
export class OrderAggregateAtLeastOneProductInOrder extends Error {}
export class OrderAggregateOnlyNewOrderCanBeConfirmed extends Error {}
export class OrderAggregateCannotCloseClosedOrder extends Error {}

export class OrderAggregate extends AggregateRoot {
  private customerId: string;
  private quantity: number;
  private status: OrderStatus = OrderStatus.New;
  private products: Product[] = [];

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
    products: Product[];
  }) {
    if (!order.products.length) {
      throw new OrderAggregateAtLeastOneProductInOrder(
        'OrderAggregateAtLeastOneProductInOrder',
      );
    }

    this.apply(
      new OrderCreatedEvent(
        this.id,
        order.customerId,
        order.quantity,
        Date.now(),
        Date.now(),
        order.issuerId,
        order.products,
      ),
    );
  }

  confirmOrder({ issuerId }: { issuerId: string }) {
    // Business rule: only customer himself can confirm order
    if (issuerId !== this.customerId) {
      throw new OrderAggregateOnlyCustomerCanConfirmOrder(
        'OrderAggregateOnlyCustomerCanConfirmOrder',
      );
    }

    if (this.status === OrderStatus.Confirmed) {
      throw new OrderAggregateOnlyNewOrderCanBeConfirmed(
        'OrderAggregateOnlyNewOrderCanBeConfirmed',
      );
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

  closeOrder({ issuerId }: { issuerId: string }) {
    if (this.status === OrderStatus.Closed) {
      throw new OrderAggregateCannotCloseClosedOrder(
        'OrderAggregateCannotCloseClosedOrder',
      );
    }

    this.apply(
      new OrderClosedEvent(
        this.id,
        issuerId,
        this.customerId,
        Date.now(),
        Date.now(),
      ),
    );
  }

  private onOrderCreatedEvent(event: OrderCreatedEvent): void {
    this.customerId = event.customerId;
    this.quantity = event.quantity;
    this.status = OrderStatus.New;
    this.products = event.products;
  }

  private onOrderConfirmedEvent(event: OrderConfirmedEvent): void {
    this.status = OrderStatus.Confirmed;
  }

  private onOrderClosedEvent(event: OrderClosedEvent): void {
    this.status = OrderStatus.Closed;
  }
}
