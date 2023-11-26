import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BrokerModule } from './broker/broker.module';
import { StockModule } from './stock/stock.module';
import { ControllerModule } from './controller/controller.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/lab5'),
    BrokerModule,
    StockModule,
    ControllerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
