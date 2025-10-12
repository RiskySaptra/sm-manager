import { ApiProperty } from '@nestjs/swagger';

export class StoreDropdownResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  id: string;

  @ApiProperty({ example: 'Main Branch' })
  label: string;
}
