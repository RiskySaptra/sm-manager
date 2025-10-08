import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'The name of the organization',
    example: 'Synergy Corp.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
