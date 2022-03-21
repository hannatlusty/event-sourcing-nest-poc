export class CloseOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly issuerId: string,
  ) {}
}
