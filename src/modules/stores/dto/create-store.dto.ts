import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({
    description: 'The name of the store',
    example: 'Gadget Store',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The location of the store',
    example: '123 Electric Avenue, Tech City',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'The timezone of the store',
    example: 'Asia/Jakarta',
    required: false,
  })
  @IsOptional()
  @IsString()
  timezone?: string;
  @ApiProperty({
    description: 'The ID of the organization to create the store in',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;
}
