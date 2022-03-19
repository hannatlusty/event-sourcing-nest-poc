import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderConfirmedEvent } from '../events/order-confirmed.event';

@EventsHandler(OrderConfirmedEvent)
export class OrderConfirmedEventHandler
  implements IEventHandler<OrderConfirmedEvent>
{
  handle(event: OrderConfirmedEvent) {}
}
