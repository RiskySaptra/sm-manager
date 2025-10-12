import { ApiProperty } from '@nestjs/swagger';
export class UserStoreDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ example: 'Administrator' })
  role: string;
}
