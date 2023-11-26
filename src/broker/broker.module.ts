import { Module } from '@nestjs/common';
import { BrokerController } from './broker.controller';
import { BrokerService } from './broker.service';
import { MongooseModule } from '@nestjs/mongoose';
import { brokerSchema } from './schema/broker.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'brokers', schema: brokerSchema }]),
  ],
  controllers: [BrokerController],
  providers: [BrokerService],
})
export class BrokerModule {}
