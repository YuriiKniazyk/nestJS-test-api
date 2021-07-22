import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthModel } from '../../db/models/dtos/auth.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async auth({ email, password }: AuthModel) {
    const user = await this.userService.findByEmail(email);
    if (!(await bcrypt.compare(password, user.password))) throw new BadRequestException(`Wrong password`);

    return {
      accessToken: 'Bearer ' + (await this.jwtService.signAsync({ id: user.id })),
    };
  }
}
