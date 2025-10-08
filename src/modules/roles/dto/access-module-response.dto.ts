import { ApiProperty } from '@nestjs/swagger';
import { AccessModule } from '../../../shared/enums/access-module.enum';

export class AccessModuleResponseDto {
  @ApiProperty({
    description: 'The module name',
    example: 'INVENTORY',
    enum: AccessModule,
  })
  module: AccessModule;

  @ApiProperty({
    description: 'Default value for canRead permission',
    example: true,
  })
  canRead: boolean;

  @ApiProperty({
    description: 'Default value for canWrite permission',
    example: false,
  })
  canWrite: boolean;

  @ApiProperty({
    description: 'Default value for canDelete permission',
    example: false,
  })
  canDelete: boolean;
}
