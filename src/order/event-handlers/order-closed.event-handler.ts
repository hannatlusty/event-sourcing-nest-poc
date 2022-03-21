import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderClosedEvent } from '../events/order-closed.event';

@EventsHandler(OrderClosedEvent)
export class OrderConfirmedEventHandler
  implements IEventHandler<OrderClosedEvent>
{
  handle(event: OrderClosedEvent) {}
}
