import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { BasicCard } from '../interface/deck.interface';
import { Transform } from 'class-transformer';

export class CreateDeckDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsObject({ each: true })
  readonly cards: BasicCard[];

  @IsDefined()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  isPublic: boolean;
}

export class DeckQueryDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly pageNumber: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly pageSize: number;
}
