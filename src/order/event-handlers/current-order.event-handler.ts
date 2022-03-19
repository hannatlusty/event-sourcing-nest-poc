import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrderConfirmedEvent } from '../events/order-confirmed.event';
import { CurrentOrderService } from '../current-order.service';

type OrderEvent = OrderCreatedEvent | OrderConfirmedEvent;

@EventsHandler(OrderCreatedEvent, OrderConfirmedEvent)
export class CurrentOrderEventHandler implements IEventHandler<OrderEvent> {
  constructor(private readonly currentOrderService: CurrentOrderService) {}

  async handle(event: OrderEvent): Promise<void> {
    console.log('handling event: ' + Object.getPrototypeOf(event));

    if (event instanceof OrderCreatedEvent) {
      await this.currentOrderService.create(event);
    } else if (event instanceof OrderConfirmedEvent) {
      await this.currentOrderService.confirm(event);
    } else {
      console.log('should not happen.');
    }
  }
}
