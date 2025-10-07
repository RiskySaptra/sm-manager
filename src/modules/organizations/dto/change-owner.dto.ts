import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ChangeOwnerDto {
  @ApiProperty({
    description: 'The ID of the new owner',
    example: '00000000-0000-0000-0000-000000000002',
  })
  @IsUUID()
  @IsNotEmpty()
  ownerId: string;
}
