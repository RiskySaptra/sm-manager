import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UpdateAccessRightsDto } from './update-access-rights.dto';

export class UpdateRoleAccessRightsDto {
  @ApiProperty({
    description: 'List of access rights for the role',
    type: [UpdateAccessRightsDto],
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateAccessRightsDto)
  accessRights: UpdateAccessRightsDto[];
}
