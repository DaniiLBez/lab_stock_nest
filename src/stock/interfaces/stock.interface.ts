import { Document } from 'mongoose';

export interface StockDocument extends Document {
  id?: number;
  ticker?: string;
  quantity?: number;
  price?: number;
}
