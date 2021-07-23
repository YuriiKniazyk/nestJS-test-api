import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../db/models/entity/user.entity';
import { UsersCreateModel } from '../../db/models/dtos/users.create.model';
import { Role } from '../../helpers/enum/role';
import { UsersUpdateModel } from '../../db/models/dtos/user.update.model';

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
    if (!(role === Role.admin || role === Role.user)) {
      throw new BadRequestException(`Role is not valid`);
    }

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

  async update(
    dto: UsersUpdateModel,
    id: number,
    reqUser,
  ): Promise<UsersUpdateModel> {
    const user = await this.findUserById(id);
    if (reqUser.id !== user.id) {
      throw new ForbiddenException("You can't update this user");
    }

    return await this.userRepository.save({ ...dto, id: user.id });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new BadRequestException(`User with email: ${email} is not exist`);
    }

    return user;
  }

  async findUserById(id: number): Promise<UserEntity> {
    if (isNaN(id)) throw new BadRequestException();

    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new BadRequestException(`User with id: ${id} is not exist`);
    }

    return await this.userRepository.findOne(id);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findUserById(id);
    return this.userRepository.delete(id);
  }
}
