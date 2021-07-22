import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../db/models/entity/user.entity';
import { UsersCreateUpdateModel } from '../../db/models/dtos/users.create.update.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(
    dto: UsersCreateUpdateModel,
  ): Promise<{ name: string; email: string }> {
    const { password, email, name } = dto;
    const user = await this.userRepository.findOne({ email });
    if (user) throw new BadRequestException(`User with email: ${email} exist`);

    const hash = await bcrypt.hash(password, 10);

    return await this.userRepository.save({
      name,
      password: hash,
      email,
    });
  }
}
