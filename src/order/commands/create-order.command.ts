import { Product } from '../product.entity';

export class CreateOrderCommand {
  constructor(
    readonly quantity: number,
    readonly customerId: string,
    readonly issuerId: string,
    readonly products: Product[],
  ) {}
}
