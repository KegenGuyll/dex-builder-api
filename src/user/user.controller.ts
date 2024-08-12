import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signup(@Req() request: Request, @Body() userClaim: UserDto) {
    const authToken: string | undefined = request.headers['authorization'];

    if (!authToken) {
      throw new UnauthorizedException();
    }

    return this.userService.createUser(authToken, userClaim);
  }
}
