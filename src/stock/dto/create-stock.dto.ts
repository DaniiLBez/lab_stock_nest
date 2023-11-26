export class CreateStockDto {
  constructor(
    public ticker: string,
    public quantity: number,
    public date: string,
  ) {}
}
