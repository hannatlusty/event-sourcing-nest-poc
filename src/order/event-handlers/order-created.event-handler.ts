import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderCreatedEvent } from '../events/order-created.event';

@EventsHandler(OrderCreatedEvent)
export class OrderCreatedEventHandler
  implements IEventHandler<OrderCreatedEvent>
{
  constructor() {
    console.log();
  }

  handle(event: OrderCreatedEvent) {}
}
