import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(
    createStoreDto: CreateStoreDto,
    organizationId: string,
  ): Promise<Store> {
    const store = this.storeRepository.create({
      ...createStoreDto,
      organizationId: createStoreDto.organizationId ?? organizationId,
    });

    return this.storeRepository.save(store);
  }

  async findAll(): Promise<Store[]> {
    return this.storeRepository.find({ relations: ['organization'] });
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepository.findOneBy({ id });
    if (!store) {
      throw new NotFoundException(`Store with ID "${id}" not found`);
    }
    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);
    Object.assign(store, updateStoreDto);
    return this.storeRepository.save(store);
  }

  async remove(id: string): Promise<void> {
    const result = await this.storeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Store with ID "${id}" not found`);
    }
  }
}
