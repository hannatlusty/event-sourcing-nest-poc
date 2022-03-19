import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { CreateOrderCommand } from '../commands/create-order.command';
import { OrderRepository } from '../order.repository';
import { OrderCreatedEvent } from '../events/order-created.event';
import { ConfirmOrderCommand } from '../commands/confirm-order.command';

@CommandHandler(ConfirmOrderCommand)
export class ConfirmOrderCommandHandler
  implements ICommandHandler<ConfirmOrderCommand>
{
  constructor(
    private readonly repository: OrderRepository,
    private readonly publisher: EventPublisher,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ConfirmOrderCommand): Promise<void> {
    try {
      const { issuerId, orderId } = command;

      const aggregate = await this.repository.findById(orderId);

      aggregate.confirmOrder({
        issuerId,
      });

      await this.repository.save(aggregate);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
