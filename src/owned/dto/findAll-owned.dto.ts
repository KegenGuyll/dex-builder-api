import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindAllOwnedQueryDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly pageNumber: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly pageSize: number;
}
