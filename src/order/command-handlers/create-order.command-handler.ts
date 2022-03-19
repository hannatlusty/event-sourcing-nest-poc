import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { CreateOrderCommand } from '../commands/create-order.command';
import { OrderRepository } from '../order.repository';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrderEventType, OrderStatus } from '../types';

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler
  implements ICommandHandler<CreateOrderCommand>
{
  constructor(private readonly repository: OrderRepository) {}

  async execute(command: CreateOrderCommand): Promise<string> {
    const { quantity, customerId, issuerId } = command;
    const aggregate = await this.repository.create();

    aggregate.createOrder({
      customerId,
      quantity,
      issuerId,
    });

    await this.repository.save(aggregate);

    return aggregate.orderId;
  }
}
