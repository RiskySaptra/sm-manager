import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreDetailsResponseDto } from './dto/store-details-response.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.storeRepository.create({
      ...createStoreDto,
    });

    return this.storeRepository.save(store);
  }

  async findAll(): Promise<Store[]> {
    return this.storeRepository.find({ relations: ['organization'] });
  }

  async findAllByOrganization(organizationId: string): Promise<Store[]> {
    return this.storeRepository.find({ where: { organizationId } });
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: [
        'organizationUsers',
        'organizationUsers.user',
        'organizationUsers.role',
      ],
    });
    if (!store) {
      throw new NotFoundException(`Store with ID "${id}" not found`);
    }
    return store;
  }

  normalizeStoreDetails(store: Store): StoreDetailsResponseDto {
    const users = store.organizationUsers.map((orgUser) => ({
      id: orgUser.user.id,
      name: orgUser.user.name,
      email: orgUser.user.email,
      role: {
        id: orgUser.role.id,
        name: orgUser.role.name,
      },
    }));

    return {
      id: store.id,
      name: store.name,
      location: store.location,
      timezone: store.timezone,
      users,
    };
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);
    Object.assign(store, updateStoreDto);
    return this.storeRepository.save(store);
  }

  async remove(id: string): Promise<void> {
    const result = await this.storeRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Store with ID "${id}" not found`);
    }
  }
}
