import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockGateway } from './stock.gateway';
import { BrokerService } from '../broker/broker.service';

@Module({
  providers: [StockGateway, StockService, BrokerService],
})
export class StockModule {}
