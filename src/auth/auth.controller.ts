/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dtos';
import { Tokens } from 'src/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // register user
  @Post('/local/register')
  registerLocal(@Body() dto: UserDto): Promise<Tokens> {
    return this.authService.registerLocal(dto);
  }

  // login user
  @Post('/local/login')
  loginLocal(@Body() dto: UserDto): Promise<Tokens> {
    return this.authService.loginLocal(dto);
  }

  // logut user
  @Post('/local/logout')
  logout() {
    return this.authService.logout();
  }

  // refresh user token
  @Post('/local/refresh')
  refreshToken() {
    return this.authService.refreshToken();
  }
}
