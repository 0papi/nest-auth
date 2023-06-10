/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';
export class UserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
