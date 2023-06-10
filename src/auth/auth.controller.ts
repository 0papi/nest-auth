/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dtos';
import { Tokens } from 'src/types';

import { Request } from 'express';
import { AtGuard } from '../common/guards/at.guard';
import { RtGuard } from '../common/guards/rt.guard';
import { GetCurrentUserId } from '../common/decorators/get-current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // register user
  @Public()
  @Post('/local/register')
  @HttpCode(HttpStatus.CREATED)
  registerLocal(@Body() dto: UserDto): Promise<Tokens> {
    return this.authService.registerLocal(dto);
  }

  // login user
  @Public()
  @Post('/local/login')
  @HttpCode(HttpStatus.OK)
  loginLocal(@Body() dto: UserDto): Promise<Tokens> {
    return this.authService.loginLocal(dto);
  }

  // logut user
  @Post('/local/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  // refresh user token
  @UseGuards(RtGuard)
  @Post('/local/refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Req() req: Request) {
    const user = req.user;
    return this.authService.refreshToken(user['sub'], user['refreshToken']);
  }
}
