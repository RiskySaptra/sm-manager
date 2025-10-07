import { PartialType } from '@nestjs/swagger';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';

export class UpdateUserDto extends PartialType(AuthCredentialsDto) {}