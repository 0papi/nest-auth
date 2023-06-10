import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RtJwtStrategy } from './strategies/rt.strategy';
import { AtJwtStrategy } from './strategies/at.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, RtJwtStrategy, AtJwtStrategy],
})
export class AuthModule {}
