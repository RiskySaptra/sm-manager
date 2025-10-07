import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessRight } from 'src/core/entities/access-right.entity';
import { Role } from 'src/core/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateAccessRightsDto } from './dto/update-access-rights.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(AccessRight)
    private readonly accessRightRepository: Repository<AccessRight>,
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

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }
  }

  async updateAccessRights(
    id: string,
    updateAccessRightsDto: UpdateAccessRightsDto,
  ): Promise<AccessRight> {
    const role = await this.findOne(id);
    let accessRight = await this.accessRightRepository.findOne({
      where: { roleId: role.id, module: updateAccessRightsDto.module },
    });
    if (!accessRight) {
      accessRight = this.accessRightRepository.create({
        roleId: role.id,
        module: updateAccessRightsDto.module,
      });
    }
    Object.assign(accessRight, updateAccessRightsDto);
    return this.accessRightRepository.save(accessRight);
  }
}
