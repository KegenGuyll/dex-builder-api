import { Controller, Param, Post } from '@nestjs/common';
import { CardService } from './card.service';

@Controller('card')
export class CardController {
  constructor(private cardService: CardService) {}

  @Post(':cardId')
  async create(@Param('cardId') cardId: string): Promise<string> {
    await this.cardService.create(cardId);

    return 'Card created';
  }
}
