import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString, Min } from 'class-validator';

export class CreateOwnedDto {
  @IsDefined()
  @IsString()
  readonly cardId: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly count: number;

  @IsString()
  readonly notes: string;
}
