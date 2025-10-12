import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignUserDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1' })
  @IsUUID()
  organizationId: string;

  @ApiProperty({ example: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12' })
  @IsUUID()
  storeId: string;

  @ApiProperty({ example: 'd4e5f6a7-b8c9-0123-4567-890abcdef123' })
  @IsUUID()
  roleId: string;
}
