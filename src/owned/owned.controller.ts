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
import { OwnedService } from './owned.service';
import { Auth } from 'src/decorators/auth.decorator';
import { CreateOwnedDto } from 'src/owned/dto/create-owned.dto';
import { FindAllOwnedQueryDto } from './dto/findAll-owned.dto';

@Controller('owned')
export class OwnedController {
  constructor(private ownedService: OwnedService) {}

  @Post()
  @Auth('USER')
  create(@Body() ownedDto: CreateOwnedDto, @Req() req: Request) {
    const authToken: string = (req.headers as any).authorization;

    return this.ownedService.create(authToken, ownedDto);
  }

  @Get()
  @Auth('USER')
  findAll(@Req() req: Request, @Query() ownedQueryDto: FindAllOwnedQueryDto) {
    const authToken: string = (req.headers as any).authorization;

    return this.ownedService.findAll(authToken, ownedQueryDto);
  }

  @Get('/net-worth')
  @Auth('USER')
  netWorth(@Req() req: Request) {
    const authToken: string = (req.headers as any).authorization;

    return this.ownedService.findTotalNetWorth(authToken);
  }

  @Get('/set/:setId')
  @Auth('USER')
  findBySetId(@Req() req: Request, @Param('setId') setId: string) {
    const authToken: string = (req.headers as any).authorization;

    return this.ownedService.findBySetId(authToken, setId);
  }

  @Get(':ownedId')
  @Auth('USER')
  findOne(@Req() req: Request, @Param('ownedId') ownedId: string) {
    const authToken: string = (req.headers as any).authorization;

    return this.ownedService.findOne(authToken, ownedId);
  }

  @Put()
  @Auth('USER')
  update(@Req() req: Request, @Body() ownedDto: CreateOwnedDto) {
    const authToken: string = (req.headers as any).authorization;

    return this.ownedService.update(authToken, ownedDto);
  }

  @Delete(':ownedId')
  @Auth('USER')
  delete(@Req() req: Request, @Param('ownedId') ownedId: string) {
    const authToken: string = (req.headers as any).authorization;

    return this.ownedService.remove(authToken, ownedId);
  }
}
