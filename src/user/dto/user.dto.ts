import { IsNotEmpty, IsEnum } from 'class-validator';

enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  DEVELOPER = 'DEVELOPER',
}

export class UserDto {
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;
}
