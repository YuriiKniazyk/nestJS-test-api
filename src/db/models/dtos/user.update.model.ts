import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UsersUpdateModel {
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(2)
  name: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(2)
  lastName: string;
}
