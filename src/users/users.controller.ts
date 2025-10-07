import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/core/entities/user.entity';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  @Get('/me')
  @ApiBearerAuth()
  me(@GetUser() user: User): User {
    return user;
  }
}
