import { IsArray, IsNumber, IsString } from 'class-validator';
import { Product } from './product.entity';

export class CreateOrderDto {
  @IsNumber()
  quantity: number;

  @IsString()
  customerId: string;

  @IsString()
  issuerId: string;

  @IsArray()
  products: Product[];
}

export interface CloseOrderDto {
  id: string;
}

export interface ConfirmOrderDto {
  issuerId: string;
}

export enum OrderStatus {
  New = 'New',
  Confirmed = 'Confirmed',
  Closed = 'Closed',
}

export enum OrderEventType {
  CreateOrder = 'CreateOrder',
  ConfirmOrder = 'ConfirmOrder',
  CloseOrder = 'CloseOrder',
}

export interface CreateOrderEventDto {
  issuerId: string;
  customerId: string;
  quantity: number;
  created: number;
  updated: number;
  status: OrderStatus;
  name: string;
}
