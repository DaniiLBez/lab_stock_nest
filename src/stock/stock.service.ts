import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { StockModel } from './schema/stock.schema';
import { Stock } from './entities/stock.entity';
import { PricesModel } from './schema/price.shema';
import { BrokerService } from '../broker/broker.service';
import { Broker } from '../broker/interfaces/broker.interface';

@Injectable()
export class StockService {
  date: Date = new Date('2022-11-14');
  constructor(private readonly brokerService: BrokerService) {}

  updateDate(date: Date): void {
    this.date = new Date(date);
  }

  async create(createStockDto: CreateStockDto) {
    const id = (await this.getLastId()) + 1;
    const stock = new Stock(id, createStockDto.ticker, createStockDto.quantity);
    stock.price = await stock.getPrice(new Date(createStockDto.date));
    const createdStock = new StockModel(stock);
    return createdStock.save();
  }

  async findAll() {
    try {
      const stocks = await StockModel.find({}).exec();
      const stockObjects: Stock[] = await Promise.all(
        stocks.map(async (stock) => {
          const stockObj = Stock.fromDocument(stock);
          stockObj.date = this.date.toISOString().split('T')[0];
          stockObj.price = await stockObj.getPrice(this.date);
          return stockObj;
        }),
      );
      return stockObjects;
    } catch (error: any) {
      throw new Error(`Error during fetching all stocks: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      return await StockModel.findOne({ id: id }).exec();
    } catch (error: any) {
      throw new Error(
        `Error during fetching stock with id ${id}: ${error.message}`,
      );
    }
  }

  async update(id: number, updateStockDto: UpdateStockDto) {
    try {
      return await StockModel.findOneAndUpdate({ id: id }, updateStockDto, {
        new: true,
      }).exec();
    } catch (error: any) {
      throw new Error(
        `Error during updating stock with id ${id}: ${error.message}`,
      );
    }
  }

  async getHistoricalData() {
    try {
      return await PricesModel.find({}).exec();
    } catch (error: any) {
      throw new Error(`Error during sending historical data: ${error.message}`);
    }
  }

  async remove(id: number) {
    const result = await StockModel.deleteOne({ id: id }).exec();
    return result.deletedCount === 1;
  }

  async buy(id: number, quantity: number, brokerId: number) {
    try {
      if (quantity < 0) return null;

      const stock = Stock.fromDocument(await this.findOne(id));

      const currentPrice = await stock.getPrice(this.date);

      if (!currentPrice) {
        console.warn(
          `[Service][Stock] Stock with id ${id} not available on ${this.date}`,
        );
        return null;
      }

      const broker: Broker = await this.brokerService.getByID(brokerId);

      if (broker.balance < quantity * currentPrice) {
        console.warn(`Not enough money to buy ${quantity} stocks.`);
        return null;
      }

      if (stock.quantity - quantity < 0) {
        quantity = stock.quantity;
        stock.quantity = 0;
      } else {
        stock.quantity -= quantity;
      }

      if (!broker.stocks.has(stock.ticker)) {
        broker.stocks.set(stock.ticker, { quantity: 0, purchasePrice: 0 });
      }

      broker.stocks.get(stock.ticker).quantity += quantity;
      broker.stocks.get(stock.ticker).purchasePrice =
        broker.stocks.get(stock.ticker).quantity * currentPrice;
      broker.balance -= quantity * currentPrice;

      await this.brokerService.update(broker.id, broker);
      await this.update(id, stock);

      return {
        quantity: quantity,
        price: currentPrice,
        ticker: stock.ticker,
      };
    } catch (error: any) {
      console.warn(`Error buying stock: ${error.message}`);
    }
  }

  async sell(id: number, quantity: number, brokerId: number) {
    try {
      if (quantity < 0) return null;

      const stock = Stock.fromDocument(await this.findOne(id));

      const currentPrice = await stock.getPrice(this.date);

      if (!currentPrice) {
        console.warn(
          `[Service][Stock] Stock with id ${id} not available on ${this.date}`,
        );
        return null;
      }

      const broker: Broker = await this.brokerService.getByID(brokerId);

      if (broker.stocks.get(stock.ticker).quantity - quantity < 0) {
        return null;
      }

      stock.quantity += quantity;
      broker.stocks.get(stock.ticker).quantity -= quantity;
      broker.stocks.get(stock.ticker).purchasePrice =
        broker.stocks.get(stock.ticker).quantity * currentPrice;
      broker.balance += quantity * currentPrice;

      await this.brokerService.update(broker.id, broker);
      await this.update(id, stock);

      return {
        quantity: quantity,
        price: currentPrice,
        ticker: stock.ticker,
      };
    } catch (error: any) {
      console.warn(`Error selling stock: ${error.message}`);
    }
  }

  async getLastId(): Promise<number> {
    const lastDoc = await StockModel.findOne({}).sort({ $natural: -1 }).exec();
    return lastDoc?.id;
  }
}
