import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { DeckService } from './deck.service';
import { Deck } from './interface/deck.interface';
import { CreateDeckDto } from './dto/create-deck.dto';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';

@Controller('deck')
export class DeckController {
  constructor(private deckService: DeckService) {}

  @Post()
  async create(
    @Body(new ValidationPipe()) createDeckDto: CreateDeckDto,
  ): Promise<string> {
    await this.deckService.create(createDeckDto);

    return 'This action adds a new deck';
  }

  @Get()
  findAll(): Deck[] {
    return this.deckService.findAll();
  }

  @Get(':deckId')
  findOne(@Param('deckId', ParseIntPipe) deckId: number): string {
    console.log(deckId);
    return `This action returns a #${deckId} deck`;
  }

  @Put(':deckId')
  update(@Param('deckId', ParseIntPipe) deckId: number): string {
    return `This action updates a #${deckId} deck`;
  }

  @Delete(':deckId')
  remove(@Param('deckId', ParseIntPipe) deckId: number): string {
    return `This action removes a #${deckId} deck`;
  }
}
