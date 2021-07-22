import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCreateUpdateModel } from '../../db/models/dtos/users.create.update.model';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() dto: UsersCreateUpdateModel) {
    return await this.userService.create(dto);
  }
}
