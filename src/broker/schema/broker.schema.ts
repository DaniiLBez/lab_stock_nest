import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { Broker } from '../interfaces/broker.interface';

export const brokerSchema = new Schema({
  id: Number,
  name: String,
  company: String,
  balance: Number,
  role: String,
  stocks: {
    type: Map,
    of: {
      quantity: Number,
      purchasePrice: Number,
    },
  },
});

export const BrokerModel = mongoose.model<Broker>('brokers', brokerSchema);
