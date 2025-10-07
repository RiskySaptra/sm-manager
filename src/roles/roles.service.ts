import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/core/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(
    createRoleDto: CreateRoleDto,
    organizationId: string,
  ): Promise<Role> {
    const role = this.roleRepository.create({
      ...createRoleDto,
      organizationId,
    });

    return this.roleRepository.save(role);
  }
}
