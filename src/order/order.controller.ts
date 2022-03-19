import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ConfirmOrderDto, CreateOrderDto } from './types';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from './commands/create-order.command';
import { OrderAggregate } from './order.aggregate';
import { GetOrdersQuery } from './queries/get-orders.query';
import { ConfirmOrderCommand } from './commands/confirm-order.command';

@Controller('order')
export class OrderController {
  constructor(
    private readonly appService: OrderService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.commandBus
      .execute(
        new CreateOrderCommand(dto.quantity, dto.customerId, dto.issuerId),
      )
      .then((orderId) => ({ orderId }));
  }

  @Post(':id/confirm')
  async confirmOrder(
    @Body() dto: ConfirmOrderDto,
    @Param('id') orderId: string,
  ) {
    return this.commandBus.execute(
      new ConfirmOrderCommand(orderId, dto.issuerId),
    );
  }

  @Get()
  async findAllOrders(): Promise<OrderAggregate[]> {
    return this.queryBus.execute(new GetOrdersQuery());
  }
}