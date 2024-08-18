import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserRoleDto } from './dto/user.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { User } from 'src/schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signup(@Req() request: Request, @Body() userClaim: CreateUserDto) {
    const authToken: string | undefined = request.headers['authorization'];

    if (!authToken) {
      throw new UnauthorizedException();
    }

    return this.userService.createUser(authToken, userClaim);
  }

  @Get('')
  @Auth('ADMIN')
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':username/collection')
  async findUserCollection(@Param('username') username: string) {
    return this.userService.findUserCollection(username);
  }

  @Get(':username/net-worth')
  async findUserNetWorth(@Param('username') username: string) {
    return this.userService.findUserNetWorth(username);
  }

  @Put(':userId/role')
  @Auth('ADMIN')
  async updateRole(@Param('userId') userId: string, @Body() role: UserRoleDto) {
    return this.userService.updateUserRole(userId, role);
  }

  @Put(':userId')
  @Auth('USER')
  update(@Req() request: Request, @Body() userDto: UpdateUserDto) {
    const authToken: string | undefined = request.headers['authorization'];

    if (!authToken) {
      throw new UnauthorizedException();
    }

    return this.userService.updateUser(authToken, userDto);
  }

  @Get('me')
  @Auth('USER')
  async me(@Req() request: Request) {
    const authToken: string | undefined = request.headers['authorization'];

    if (!authToken) {
      throw new UnauthorizedException();
    }

    return this.userService.me(authToken);
  }
}
