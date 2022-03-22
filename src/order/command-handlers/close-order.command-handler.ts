import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OrderRepository } from '../order.repository';
import { CloseOrderCommand } from '../commands/close-order.commnand';

@CommandHandler(CloseOrderCommand)
export class CloseOrderCommandHandler
  implements ICommandHandler<CloseOrderCommand>
{
  constructor(private readonly repository: OrderRepository) {}

  async execute(command: CloseOrderCommand): Promise<void> {
    try {
      const { orderId, issuerId } = command;

      const aggregate = await this.repository.findById(orderId);

      aggregate.closeOrder({
        issuerId,
      });

      await this.repository.save(aggregate);
    } catch (error) {
      throw error;
    }
  }
}
