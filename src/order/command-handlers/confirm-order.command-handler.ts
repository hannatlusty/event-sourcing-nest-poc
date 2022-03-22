import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OrderRepository } from '../order.repository';
import { ConfirmOrderCommand } from '../commands/confirm-order.command';

@CommandHandler(ConfirmOrderCommand)
export class ConfirmOrderCommandHandler
  implements ICommandHandler<ConfirmOrderCommand>
{
  constructor(private readonly repository: OrderRepository) {}

  async execute(command: ConfirmOrderCommand): Promise<void> {
    try {
      const { issuerId, orderId } = command;
      const aggregate = await this.repository.findById(orderId);

      aggregate.confirmOrder({
        issuerId,
      });

      await this.repository.save(aggregate);
    } catch (error) {
      throw error;
    }
  }
}
