import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:example@mongo:27017/'),
    OrderModule,
  ],
})
export class AppModule {}
