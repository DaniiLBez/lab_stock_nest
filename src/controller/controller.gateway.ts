import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ControllerService } from './controller.service';
import { ApiOperation } from '@nestjs/swagger';
import { io } from 'socket.io-client';
import { STOCKS_SOCKET_URI } from '../config';

@WebSocketGateway({
  namespace: '/controller',
  cors: {
    origin: '*',
  },
})
export class ControllerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly server = io(STOCKS_SOCKET_URI);

  constructor(private readonly controllerService: ControllerService) {
    controllerService.onClock = this.clock;
  }

  public afterInit(): any {
    this.server.on('connect', () => {
      console.debug('Connected to stocks');
    });
    console.debug('Initialized');
  }

  public handleConnection(client: any): any {
    console.debug(`Client connected: ${client.id}`);
  }

  public handleDisconnect(client: any): any {
    console.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('setDate')
  @ApiOperation({ summary: 'Set starting date' })
  setDate(@MessageBody() date: string): void {
    console.debug(`Date set: ${date}`);
    this.controllerService.date = new Date(date);
    this.server.emit('clockStocks', {
      date: this.controllerService.date,
    });
  }

  @SubscribeMessage('setClockDelay')
  @ApiOperation({ summary: 'Set sending delay' })
  setClockDelay(@MessageBody() delay: number): void {
    console.debug(`Clock delay set: ${delay}`);
    this.controllerService.setClockSpeed(delay);
  }

  @SubscribeMessage('startClock')
  @ApiOperation({ summary: 'Start clocking' })
  startClockMessage(): void {
    console.debug(`Clock started`);
    this.controllerService.startClock();
  }

  @SubscribeMessage('stopClock')
  @ApiOperation({ summary: 'Stop clocking' })
  stopClockMessage(): void {
    console.debug(`Clock stopped`);
    this.controllerService.stopClock();
  }

  private clock = (date: Date) => {
    this.server.emit('clockStocks', {
      date: date,
    });
  };
}
