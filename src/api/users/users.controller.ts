import { Body, Controller, Post, Get, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UsersCreateModel } from '../../db/models/dtos/users.create.model';
import { JwtAuthGuard } from '../../helpers/guards/jwt.auth.guards';
import { UrlParams } from '../../helpers/enum/url.params';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Query('take') take?: number, @Query('skip') skip?: number) {
    take > UrlParams.take || isNaN(take) ? (take = UrlParams.take) : take;
    return await this.userService.getAll(take, skip);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: UsersCreateModel) {
    return await this.userService.create(dto);
  }
}
