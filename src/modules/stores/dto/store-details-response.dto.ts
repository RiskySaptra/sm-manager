import { ApiProperty } from '@nestjs/swagger';

class RoleResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  id: string;

  @ApiProperty({ example: 'Store Manager' })
  name: string;
}

class UserWithRoleResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ type: () => RoleResponseDto })
  role: RoleResponseDto;
}

export class StoreDetailsResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  id: string;

  @ApiProperty({ example: 'Gadget Store' })
  name: string;

  @ApiProperty({ example: '123 Electric Avenue, Tech City' })
  location: string;

  @ApiProperty({ example: 'Asia/Jakarta' })
  timezone: string;

  @ApiProperty({ type: () => [UserWithRoleResponseDto] })
  users: UserWithRoleResponseDto[];
}
