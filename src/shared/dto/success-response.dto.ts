import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Operation successful' })
  message: string;
}
