import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ConfirmOrderDto, CreateOrderDto } from './types';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from './commands/create-order.command';
import { OrderAggregate } from './order.aggregate';
import { GetOrdersQuery } from './queries/get-orders.query';
import { ConfirmOrderCommand } from './commands/confirm-order.command';
import { OrderEvent } from './order-event.schema';
import { GetOrderHistoryQuery } from './queries/get-order-history.query';
import { CloseOrderCommand } from './commands/close-order.commnand';

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
        new CreateOrderCommand(
          dto.quantity,
          dto.customerId,
          dto.issuerId,
          dto.products,
        ),
      )
      .then((orderId) => ({ orderId }));
  }
  @Post(':id/close')
  async closeOrder(
    @Body() dto: { issuerId: string },
    @Param('id') orderId: string,
  ) {
    try {
      return await this.commandBus.execute(
        new CloseOrderCommand(orderId, dto.issuerId),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/confirm')
  async confirmOrder(
    @Body() dto: ConfirmOrderDto,
    @Param('id') orderId: string,
  ) {
    try {
      return await this.commandBus.execute(
        new ConfirmOrderCommand(orderId, dto.issuerId),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id/history')
  async getOrderHistory(@Param('id') orderId: string): Promise<OrderEvent[]> {
    return this.queryBus.execute(new GetOrderHistoryQuery(orderId));
  }

  @Get()
  async findAllOrders(): Promise<OrderAggregate[]> {
    return this.queryBus.execute(new GetOrdersQuery());
  }
}
