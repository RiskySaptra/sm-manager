import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAccessRightsDto {
  @ApiProperty({
    description: 'The ID of the module to update',
    example: 'INVENTORY',
  })
  @IsString()
  @IsNotEmpty()
  module: string;

  @ApiProperty({
    description: 'Whether the role can read from the module',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  canRead: boolean;

  @ApiProperty({
    description: 'Whether the role can write to the module',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  canWrite: boolean;

  @ApiProperty({
    description: 'Whether the role can delete from the module',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  canDelete: boolean;
}
