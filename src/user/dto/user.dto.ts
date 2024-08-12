import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsDefined,
  IsBoolean,
} from 'class-validator';

enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  DEVELOPER = 'DEVELOPER',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsDefined()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  public: boolean;
}

export class UpdateUserDto extends CreateUserDto {
  @IsString()
  photoURL: string;

  @IsString()
  email: string;
}

export class UserRoleDto {
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;
}
