import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { DeckService } from './deck.service';
import { CreateDeckDto, DeckQueryDto } from './dto/create-deck.dto';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { Auth } from 'src/decorators/auth.decorator';
import { Deck } from 'src/schemas/deck.schema';
import {
  DeckWithCards,
  DeckWithCardsResponse,
} from './interface/deck.interface';

@Controller('deck')
export class DeckController {
  constructor(private deckService: DeckService) {}

  @Post()
  @Auth('USER')
  create(
    @Body(new ValidationPipe()) createDeckDto: CreateDeckDto,
    @Req() req: Request,
  ): Promise<Deck> {
    const authToken: string = (req.headers as any).authorization;

    return this.deckService.create(createDeckDto, authToken);
  }

  @Get()
  @Auth('USER')
  findAll(
    @Req() req: Request,
    @Query() deckQueryDto: DeckQueryDto,
  ): Promise<DeckWithCardsResponse> {
    const authToken: string = (req.headers as any).authorization;

    return this.deckService.findAll(
      authToken,
      deckQueryDto.pageNumber,
      deckQueryDto.pageSize,
    );
  }

  @Get(':deckId')
  @Auth('USER')
  findOne(
    @Param('deckId') deckId: string,
    @Req() req: Request,
  ): Promise<DeckWithCards> {
    const authToken: string = (req.headers as any).authorization;

    return this.deckService.findOne(deckId, authToken);
  }

  @Put(':deckId')
  @Auth('USER')
  update(
    @Param('deckId') deckId: string,
    @Body(new ValidationPipe()) updateDeckDto: CreateDeckDto,
    @Req() req: Request,
  ): Promise<Deck> {
    const authToken: string = (req.headers as any).authorization;

    return this.deckService.update(deckId, updateDeckDto, authToken);
  }

  @Delete(':deckId')
  @Auth('USER')
  remove(
    @Param('deckId') deckId: string,
    @Req() req: Request,
  ): Promise<string> {
    const authToken: string = (req.headers as any).authorization;

    return this.deckService.remove(deckId, authToken);
  }
}
