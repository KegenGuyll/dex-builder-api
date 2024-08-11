import { IsInt, IsString } from 'class-validator';

export class CreateDeckDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsInt({ each: true })
  readonly cards: number[];
}
