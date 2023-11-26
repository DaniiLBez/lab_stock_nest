import { Document } from 'mongoose';

export interface Broker extends Document {
  id?: number;
  name: string;
  company: string;
  balance: number;
  role: string;
  stocks: Record<string, { quantity: number; purchasePrice: number }>;
}
