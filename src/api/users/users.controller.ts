import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { UsersService } from './users.service';
import { UsersCreateModel } from '../../db/models/dtos/users.create.model';
import { JwtAuthGuard } from '../../helpers/guards/jwt.auth.guards';
import { UrlParams } from '../../helpers/enum/url.params';
import { RolesGuard } from '../../helpers/guards/role.guards';
import { Role } from '../../helpers/enum/role';
import { UsersUpdateModel } from '../../db/models/dtos/user.update.model';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(RolesGuard([Role.admin, Role.superAdmin, Role.user]))
  @Get()
  async getAll(@Query('take') take: number, @Query('skip') skip: number) {
    take > UrlParams.take || isNaN(take) ? (take = UrlParams.take) : take;
    return await this.userService.getAll(take, skip);
  }

  @UseGuards(RolesGuard([Role.superAdmin]))
  @Post()
  async create(@Body() dto: UsersCreateModel) {
    return await this.userService.create(dto);
  }

  @UseGuards(RolesGuard([Role.admin, Role.superAdmin, Role.user]))
  @Patch(':id')
  async update(
    @Body() dto: UsersUpdateModel,
    @Param('id') id: number,
    @Req() req: Request,
  ) {
    return await this.userService.update(dto, id, req.user);
  }

  @UseGuards(RolesGuard([Role.superAdmin]))
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.userService.delete(id);
  }
}
