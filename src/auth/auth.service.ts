/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dtos';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from 'src/types';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  //   creat user
  async registerLocal(user: UserDto) {
    const hash = await this.hashData(user.password);
    const newUser = this.prisma.user.create({
      data: {
        email: user.email,
        hash,
      },
    });

    const tokens = await this.getTokens(
      (
        await newUser
      ).id,
      (
        await newUser
      ).email,
    );

    await this.updateRtHash((await newUser).id, tokens.refresh_token);
    return tokens;
  }

  // login user

  async loginLocal(user: UserDto): Promise<Tokens> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!existingUser) {
      throw new ForbiddenException('Access denied');
    }

    const passwordMatches = await bcrypt.compare(
      user.password,
      existingUser.hash,
    );

    if (!passwordMatches) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens(
      (
        await existingUser
      ).id,
      (
        await existingUser
      ).email,
    );

    await this.updateRtHash((await existingUser).id, tokens.refresh_token);
    return tokens;
  }

  // logut user

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashRt: {
          not: null,
        },
      },
      data: {
        hashRt: null,
      },
    });
  }

  // refresh user token

  async refreshToken(userId: number, rt: string) {
    const user = this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    const rtMatches = await bcrypt.compare(rt, (await user).hashRt);

    if (!rtMatches) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens((await user).id, (await user).email);

    await this.updateRtHash((await user).id, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashRt: hash,
      },
    });
  }
}
