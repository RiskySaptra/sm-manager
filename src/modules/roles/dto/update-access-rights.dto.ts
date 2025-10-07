import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { AccessModule } from 'src/core/enums/access-module.enum';

export class UpdateAccessRightsDto {
  @ApiProperty({
    description: 'The module to update',
    example: 'INVENTORY',
  })
  @IsEnum(AccessModule)
  @IsNotEmpty()
  module: AccessModule;

  @ApiProperty({
    description: 'Whether the role can read from the module',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  canRead: boolean;

  @ApiProperty({
    description: 'Whether the role can write to the module',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  canWrite: boolean;

  @ApiProperty({
    description: 'Whether the role can delete from the module',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  canDelete: boolean;
}
