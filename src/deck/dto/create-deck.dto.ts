import { IsObject, IsString } from 'class-validator';
import { Card } from '../interface/deck.interface';

export class CreateDeckDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsObject({ each: true })
  readonly cards: Card[];
}
