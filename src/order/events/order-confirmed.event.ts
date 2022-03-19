export class OrderConfirmedEvent {
  constructor(
    readonly orderId: string,
    readonly issuerId: string,
    readonly customerId: string,
    readonly created: number,
    readonly updated: number,
  ) {}
}
