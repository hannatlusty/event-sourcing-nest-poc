export class CreateOrderCommand {
  constructor(
    readonly quantity: number,
    readonly customerId: string,
    readonly issuerId: string,
  ) {}
}
