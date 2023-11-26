import * as mongoose from 'mongoose';

export const StockSchema = new mongoose.Schema({
  id: Number,
  ticker: String,
  quantity: Number,
});

export const StockModel = mongoose.model('stocks', StockSchema);
