import * as mongoose from 'mongoose';

export const priceDataSchema = new mongoose.Schema({
  Date: String,
  Close: {
    Last: String,
  },
  Volume: Number,
  Open: String,
  High: String,
  Low: String,
});

export const pricesSchema = new mongoose.Schema({
  ticker: String,
  company: String,
  data: [priceDataSchema],
});

export const PricesModel = mongoose.model('prices', pricesSchema);
