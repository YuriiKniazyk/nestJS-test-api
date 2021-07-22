import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../db/models/entity/user.entity';
import { UsersCreateModel } from '../../db/models/dtos/users.create.model';
import { Role } from '../../helpers/enum/role';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAll(take: number, skip: number) {
    const users = await this.userRepository.findAndCount({
      take,
      skip,
    });

    return {
      count: users[1],
      rows: users[0],
    };
  }

  async create(
    dto: UsersCreateModel,
  ): Promise<{ name: string; role: string; id: number }> {
    const { password, email, name, role } = dto;
    const user = await this.userRepository.findOne({ email });
    if (user) throw new BadRequestException(`User with email: ${email} exist`);
    if (!(role === Role.admin || role === Role.user))
      throw new BadRequestException(`Role is not valid`);

    const hash = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.save({
      name,
      password: hash,
      email,
      role,
    });

    return {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
    };
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ email });
    if (!user)
      throw new BadRequestException(`User with email: ${email} is not exist`);

    return user;
  }
}
