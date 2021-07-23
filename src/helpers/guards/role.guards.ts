import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../enum/role';
import { UserEntity } from '../../db/models/entity/user.entity';

export const RolesGuard = (roles: Role[]) => {
  class RolesGuardMixin implements CanActivate {
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>;

    async canActivate(ctx: ExecutionContext): Promise<any> {
      const request = ctx.switchToHttp().getRequest();
      const { id } = request.user;

      const user = await this.userRepository.findOne(id);
      return roles.some((role) => role === user.role);
    }
  }
  return mixin(RolesGuardMixin);
};
