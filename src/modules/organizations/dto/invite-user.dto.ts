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
    example: 'new.user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The ID of the role to assign to the user',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({
    description: 'The ID of the store to assign to the user',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsOptional()
  @IsUUID()
  storeId?: string;
}
