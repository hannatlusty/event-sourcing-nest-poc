export class ConfirmOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly issuerId: string,
  ) {}
}
