import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class AccessRightDto {
  @ApiProperty({ example: 'INVENTORY' })
  @IsString()
  module: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  canRead: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  canWrite: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  canDelete: boolean;
}
