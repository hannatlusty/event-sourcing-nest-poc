import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderEvent, OrderEventSchema } from './order-event.schema';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderSaga } from './order.saga';
import { CreateOrderCommandHandler } from './command-handlers/create-order.command-handler';
import { OrderCreatedEventHandler } from './event-handlers/order-created.event-handler';
import { GetOrdersQueryHandler } from './queries/get-orders.gery-handler';
import { OrderConfirmedEventHandler } from './event-handlers/order-confirmed.event-handler';
import { ConfirmOrderCommandHandler } from './command-handlers/confirm-order.command-handler';
import { CurrentOrderService } from './current-order.service';
import { CurrentOrder, CurrentOrderSchema } from './current-order.schema';
import { CurrentOrderEventHandler } from './event-handlers/current-order.event-handler';

const CommandHandlers = [CreateOrderCommandHandler, ConfirmOrderCommandHandler];
const EventHandlers = [
  OrderCreatedEventHandler,
  OrderConfirmedEventHandler,
  CurrentOrderEventHandler,
];
const QueryHandlers = [GetOrdersQueryHandler];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderEvent.name, schema: OrderEventSchema },
      { name: CurrentOrder.name, schema: CurrentOrderSchema },
    ]),
    CqrsModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    // OrderSaga,
    OrderRepository,
    CurrentOrderService,
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class OrderModule {}
