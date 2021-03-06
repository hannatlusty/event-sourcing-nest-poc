import { Product } from '../product.entity';

export class OrderCreatedEvent {
  constructor(
    readonly orderId: string,
    readonly customerId: string,
    readonly quantity: number,
    readonly created: number,
    readonly updated: number,
    readonly issuerId: string,
    readonly products: Product[],
  ) {}
}
