import { Controller, Param, Post, Put } from '@nestjs/common';
import { CardService } from './card.service';

@Controller('card')
export class CardController {
  constructor(private cardService: CardService) {}

  @Post(':cardId')
  async create(@Param('cardId') cardId: string): Promise<string> {
    await this.cardService.create(cardId);

    return `Card-${cardId} created`;
  }

  @Put(':cardId')
  async update(@Param('cardId') cardId: string): Promise<string> {
    await this.cardService.update(cardId);

    return `Card-${cardId} updated`;
  }
}
