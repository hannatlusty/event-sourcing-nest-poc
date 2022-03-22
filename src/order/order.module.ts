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
import { GetOrdersQueryHandler } from './queries/get-orders.query-handler';
import { OrderConfirmedEventHandler } from './event-handlers/order-confirmed.event-handler';
import { ConfirmOrderCommandHandler } from './command-handlers/confirm-order.command-handler';
import { CurrentOrderService } from './current-order.service';
import { CurrentOrder, CurrentOrderSchema } from './current-order.schema';
import { CurrentOrderEventHandler } from './event-handlers/current-order.event-handler';
import { GetOrderHistoryQueryHandler } from './queries/get-order-history.query-handler';
import { CloseOrderCommandHandler } from './command-handlers/close-order.command-handler';
import { OrderClosedEventHandler } from './event-handlers/order-closed.event-handler';

const CommandHandlers = [
  CreateOrderCommandHandler,
  ConfirmOrderCommandHandler,
  CloseOrderCommandHandler,
];
const EventHandlers = [
  OrderCreatedEventHandler,
  OrderConfirmedEventHandler,
  OrderClosedEventHandler,
  CurrentOrderEventHandler,
];
const QueryHandlers = [GetOrdersQueryHandler, GetOrderHistoryQueryHandler];

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
