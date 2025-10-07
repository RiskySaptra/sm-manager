import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { OrganizationUser } from 'src/core/entities/organization-user.entity';
import { User } from 'src/core/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OrganizationUser)
    private readonly organizationUserRepository: Repository<OrganizationUser>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password, name } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      passwordHash: hashedPassword,
      name,
    });

    try {
      await this.userRepository.save(user);
      const payload = { id: user.id };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } catch (error: unknown) {
      if ((error as { code: string }).code === '23505') {
        // duplicate username
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password, organizationId } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const payload: { id: string; organizationId?: string } = { id: user.id };

      if (organizationId) {
        const organizationUser =
          await this.organizationUserRepository.findOneBy({
            userId: user.id,
            organizationId,
          });

        if (!organizationUser) {
          throw new UnauthorizedException(
            'You are not a member of this organization',
          );
        }
        payload.organizationId = organizationId;
      }

      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
