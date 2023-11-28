import { ApiProperty } from '@nestjs/swagger';

export class CreateBrokerDTO {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  company: string;
  @ApiProperty()
  balance: number;
  @ApiProperty()
  role: string;
  @ApiProperty()
  stocks: Map<string, { quantity: number; purchasePrice: number }>;
}
