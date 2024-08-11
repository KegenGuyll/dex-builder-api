import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DeckService } from './deck.service';
import { Deck } from './interface/deck.interface';
import { CreateDeckDto } from './dto/create-deck.dto';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { Auth } from 'src/decorators/auth.decorator';

@Controller('deck')
export class DeckController {
  constructor(private deckService: DeckService) {}

  @Post()
  @Auth('USER')
  async create(
    @Body(new ValidationPipe()) createDeckDto: CreateDeckDto,
  ): Promise<string> {
    await this.deckService.create(createDeckDto);

    return 'This action adds a new deck';
  }

  @Get()
  @Auth('USER')
  findAll(): Promise<Deck[]> {
    return this.deckService.findAll();
  }

  @Get(':deckId')
  @Auth('USER')
  findOne(@Param('deckId') deckId: string): Promise<Deck> {
    return this.deckService.findOne(deckId);
  }

  @Put(':deckId')
  @Auth('USER')
  update(
    @Param('deckId') deckId: string,
    @Body(new ValidationPipe()) updateDeckDto: CreateDeckDto,
  ): Promise<Deck> {
    return this.deckService.update(deckId, updateDeckDto);
  }

  @Delete(':deckId')
  @Auth('USER')
  remove(@Param('deckId') deckId: string): Promise<string> {
    return this.deckService.remove(deckId);
  }
}
