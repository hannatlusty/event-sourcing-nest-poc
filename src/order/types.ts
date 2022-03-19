import { IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  quantity: number;

  @IsString()
  customerId: string;

  @IsString()
  issuerId: string;
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
  Delivered = 'Delivered',
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
