import { ApiProperty } from '@nestjs/swagger';
import { UserStoreDto } from './user-store.dto';

export class UserDetailsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isSuperAdmin: boolean;

  @ApiProperty()
  statusId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false, nullable: true })
  deletedAt?: Date;

  @ApiProperty({ required: false })
  organizationId?: string;

  @ApiProperty({ type: () => [UserStoreDto], required: false })
  stores?: UserStoreDto[];
}
