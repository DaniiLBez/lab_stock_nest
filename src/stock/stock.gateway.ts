import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/stock',
  cors: {
    origin: '*',
  },
})
export class StockGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly stockService: StockService) {}

  public handleConnection(client: any): any {
    console.log(`Client connected: ${client.id}`);
  }

  public handleDisconnect(client: any): any {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createStock')
  async create(@MessageBody() createStockDto: CreateStockDto) {
    return await this.stockService.create(createStockDto);
  }

  @SubscribeMessage('findAllStock')
  async findAll() {
    const stocks = await this.stockService.findAll();
    stocks.forEach((stock: any) => this.server.emit('updateStock', stock));
  }

  @SubscribeMessage('getHistoricalData')
  async getHistoricalData() {
    const data = await this.stockService.getHistoricalData();
    this.server.emit('historicalData', data);
  }

  @SubscribeMessage('findOneStock')
  async findOne(@MessageBody() id: number) {
    this.server.emit('findOneStock', await this.stockService.findOne(id));
  }

  @SubscribeMessage('updateStock')
  async update(@MessageBody() updateStockDto: UpdateStockDto) {
    return await this.stockService.update(updateStockDto.id, updateStockDto);
  }

  @SubscribeMessage('removeStock')
  async remove(@MessageBody() id: number) {
    return await this.stockService.remove(id);
  }

  @SubscribeMessage('clockStocks')
  async clockStocks(@MessageBody('date') date: Date) {
    this.stockService.updateDate(date);
    const stocks = await this.stockService.findAll();
    this.server.emit('updateStock', stocks);
  }

  @SubscribeMessage('buy')
  async buy(
    @MessageBody('id') id: number,
    @MessageBody('quantity') quantity: number,
    @MessageBody('brokerMoney') brokerMoney: number,
  ) {
    const res = await this.stockService.buy(id, quantity, brokerMoney);
    if (res === null) {
      return null;
    }

    this.server.emit('updateStock', {
      date: this.stockService.date,
      quantity: res.quantity,
      price: res.price,
      ticker: res.ticker,
    });
    return res;
  }
}
