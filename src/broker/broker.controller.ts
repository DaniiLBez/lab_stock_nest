import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { BrokerService } from './broker.service';
import { CreateBrokerDTO } from './dto/broker.dto';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';

@Controller('broker')
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @ApiOperation({ summary: 'Create a new broker' })
  @Post('/create')
  async addBroker(
    @Res() res: Response,
    @Body() CreateBrokerDto: CreateBrokerDTO,
  ) {
    try {
      const lists = await this.brokerService.create(CreateBrokerDto);
      res.status(HttpStatus.CREATED).json({
        lists,
      });
    } catch (error: any) {
      console.error(
        `[Controller][Broker] Error during creating broker`,
        error.message,
      );
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @ApiOperation({ summary: 'Get all brokers' })
  @Get('all')
  async getAll(@Res() res: Response) {
    try {
      const lists = await this.brokerService.getAll();
      res.status(HttpStatus.OK).json(lists);
    } catch (error: any) {
      console.error(
        `[Controller][Broker] Error during fetching brokers`,
        error.message,
      );
      res.status(HttpStatus.NO_CONTENT).json({ error: error.message });
    }
  }

  @ApiOperation({ summary: 'Create concrete broker' })
  @Get(':id')
  async getById(@Res() res: Response, @Param('id') id: number) {
    try {
      const broker = await this.brokerService.getByID(id);
      res.status(HttpStatus.OK).json(broker);
    } catch (error: any) {
      res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
    }
  }

  @ApiOperation({ summary: 'Update broker' })
  @Patch('update/:id')
  async update(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() CreateBrokerDTO: CreateBrokerDTO,
  ) {
    try {
      const broker = await this.brokerService.update(id, CreateBrokerDTO);
      res.status(HttpStatus.OK).json(broker);
    } catch (error: any) {
      res.status(HttpStatus.PARTIAL_CONTENT).json({ error: error.message });
    }
  }

  @ApiOperation({ summary: 'Delete broker' })
  @Delete(':id')
  async delete(@Res() res: Response, @Param('id') id: number) {
    try {
      const result = await this.brokerService.delete(id);
      res.status(HttpStatus.OK).json({ result });
    } catch (error: any) {
      res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
    }
  }
}
