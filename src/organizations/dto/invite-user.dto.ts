import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InviteUserDto {
  @ApiProperty({
    description: 'The email of the user to invite',
    example: 'invited@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The ID of the role to assign to the user',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  @IsNotEmpty()
  roleId: string;
}