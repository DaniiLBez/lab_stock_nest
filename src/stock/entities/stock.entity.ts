import { PricesModel } from '../schema/price.shema';
import { StockDocument } from '../interfaces/stock.interface';

export class Stock {
  constructor(
    public id: number,
    public ticker: string,
    public quantity: number,
    public price?: number,
    public date?: string,
  ) {}

  public getPrice = async (date: Date) => {
    const tickerData = await PricesModel.findOne({
      ticker: this.ticker,
    }).exec();

    if (tickerData) {
      const price = tickerData.data.find((item) => {
        return (
          new Date(item.Date).toISOString().split('T')[0] ===
          new Date(date).toISOString().split('T')[0]
        );
      });
      return Number(price ? price.Close.Last.split('$')[1] : 100);
    }

    return null;
  };

  static fromDocument(document: StockDocument) {
    return new Stock(document.id, document.ticker, document.quantity);
  }
}
