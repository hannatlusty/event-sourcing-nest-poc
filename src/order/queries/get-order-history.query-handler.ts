import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OrderService } from '../order.service';
import { GetOrderHistoryQuery } from './get-order-history.query';

@QueryHandler(GetOrderHistoryQuery)
export class GetOrderHistoryQueryHandler
  implements IQueryHandler<GetOrderHistoryQuery>
{
  constructor(private readonly orderEventService: OrderService) {}

  async execute(query: GetOrderHistoryQuery) {
    return this.orderEventService.findAll(
      query?.orderId ? { orderId: query.orderId } : {},
    );
  }
}
