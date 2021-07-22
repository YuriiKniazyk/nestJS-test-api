import { Body, Controller, Post } from '@nestjs/common';
import { AuthModel } from '../../db/models/dtos/auth.model';
import { AuthService } from './auth.service';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async auth(@Body() dto: AuthModel) {
    return await this.authService.auth(dto);
  }
}
