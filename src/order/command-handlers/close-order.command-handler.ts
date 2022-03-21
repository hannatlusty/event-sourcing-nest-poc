import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from '../commands/create-order.command';
import { OrderRepository } from '../order.repository';
import { CloseOrderCommand } from '../commands/close-order.commnand';
import { ConfirmOrderCommand } from '../commands/confirm-order.command';

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
