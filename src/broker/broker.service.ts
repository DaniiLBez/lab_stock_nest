import { Injectable } from '@nestjs/common';
import { CreateBrokerDTO } from './dto/broker.dto';
import { BrokerModel } from './schema/broker.schema';

@Injectable()
export class BrokerService {
  public async create(CreateBrokerDTO: CreateBrokerDTO) {
    CreateBrokerDTO.id = (await this.getLastId()) + 1;
    CreateBrokerDTO.role = CreateBrokerDTO.role || 'user';
    CreateBrokerDTO.balance = CreateBrokerDTO.balance || 0;
    CreateBrokerDTO.company = CreateBrokerDTO.company || '';
    CreateBrokerDTO.stocks = CreateBrokerDTO.stocks || new Map();
    const createdBroker = new BrokerModel(CreateBrokerDTO);
    return createdBroker.save();
  }

  public async getAll() {
    try {
      return await BrokerModel.find({}).exec();
    } catch (error: any) {
      throw new Error(`Error during fetching all brokers: ${error.message}`);
    }
  }

  public async getByID(id: number) {
    try {
      return await BrokerModel.findOne({ id: id }).exec();
    } catch (error: any) {
      throw new Error(
        `Error during fetching broker with id ${id}: ${error.message}`,
      );
    }
  }

  public async update(id: number, CreatedBrokerDto: CreateBrokerDTO) {
    try {
      return await BrokerModel.findOneAndUpdate({ id: id }, CreatedBrokerDto, {
        new: true,
      }).exec();
    } catch (error: any) {
      throw new Error(
        `Error during updating broker with id ${id}: ${error.message}`,
      );
    }
  }

  public async delete(id: number) {
    const result = await BrokerModel.deleteOne({ id: id }).exec();
    return result.deletedCount === 1;
  }

  async getLastId(): Promise<number> {
    const lastDoc = await BrokerModel.findOne({}).sort({ $natural: -1 }).exec();
    return lastDoc?.id;
  }
}
