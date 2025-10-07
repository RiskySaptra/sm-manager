import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { SuperAdminGuard } from '../../shared/guards/super-admin.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Return the current user profile.',
    type: User,
  })
  me(@GetUser() user: User): Promise<User> {
    return this.usersService.me(user);
  }

  @Get()
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: [User],
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the user.',
    type: User,
  })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User,
  })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
