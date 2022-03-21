import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from '../commands/create-order.command';
import { OrderRepository } from '../order.repository';

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler
  implements ICommandHandler<CreateOrderCommand>
{
  constructor(private readonly repository: OrderRepository) {}

  async execute(command: CreateOrderCommand): Promise<string> {
    const { quantity, customerId, issuerId, products } = command;
    const aggregate = await this.repository.create();

    aggregate.createOrder({
      customerId,
      quantity,
      issuerId,
      products,
    });

    await this.repository.save(aggregate);

    return aggregate.orderId;
  }
}
