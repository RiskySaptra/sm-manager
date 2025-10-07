import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class InviteUserDto {
  @ApiProperty({
    description: 'The email of the user to invite',
    example: 'janedoe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The ID of the role to assign to the user',
    example: '00000000-0000-0000-0000-000000000003',
  })
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({
    description: 'The ID of the store to assign to the user',
    example: '00000000-0000-0000-0000-000000000004',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  storeId?: string;
}
