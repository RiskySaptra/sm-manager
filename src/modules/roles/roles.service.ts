import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessRight } from './entities/access-right.entity';
import { Role } from './entities/role.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRoleAccessRightsDto } from './dto/update-role-access-rights.dto';
import { AccessModuleResponseDto } from './dto/access-module-response.dto';
import { AccessModule } from '../master-data/entities/access-module.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(AccessRight)
    private readonly accessRightRepository: Repository<AccessRight>,
    private readonly dataSource: DataSource,
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
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['accessRights', 'accessRights.module'],
    });
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
    updateRoleAccessRightsDto: UpdateRoleAccessRightsDto,
  ): Promise<Role> {
    const role = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Remove old access rights
      await queryRunner.manager.delete(AccessRight, { roleId: role.id });

      // Create new access rights
      const newAccessRights = updateRoleAccessRightsDto.accessRights.map(
        (accessRightDto) => {
          return this.accessRightRepository.create({
            ...accessRightDto,
            roleId: role.id,
          });
        },
      );

      if (newAccessRights.length > 0) {
        await queryRunner.manager.save(newAccessRights);
      }

      await queryRunner.commitTransaction();

      return this.findOne(id); // Refetch to get updated relations
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getAccessRightsList(id: string): Promise<AccessModuleResponseDto[]> {
    const role = await this.findOne(id); // findOne now fetches accessRights

    const accessModuleRepository = this.dataSource.getRepository(AccessModule);
    const allModules = await accessModuleRepository.find();

    const accessRightsMap = new Map(
      role.accessRights.map((ar) => [ar.moduleId, ar]),
    );

    return allModules.map((module) => {
      const existingAccessRight = accessRightsMap.get(module.id);
      if (existingAccessRight) {
        return {
          module: existingAccessRight.module,
          canRead: existingAccessRight.canRead,
          canWrite: existingAccessRight.canWrite,
          canDelete: existingAccessRight.canDelete,
        };
      } else {
        return {
          module,
          canRead: true,
          canWrite: false,
          canDelete: false,
        };
      }
    });
  }
}
