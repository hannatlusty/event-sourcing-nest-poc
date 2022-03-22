import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrdersQuery } from './get-orders.query';
import { CurrentOrderService } from '../current-order.service';

@QueryHandler(GetOrdersQuery)
export class GetOrdersQueryHandler implements IQueryHandler<GetOrdersQuery> {
  constructor(private readonly currentOrderService: CurrentOrderService) {}

  async execute(query: GetOrdersQuery) {
    return this.currentOrderService.findAll();
  }
}
