import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.createUser({
      username: dto.username,
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      role: dto.role ?? Role.USER,
    });

    const accessToken = this.signToken(user.id, user.email, user.username, user.role);

    return {
      user: this.toPublicUser(user.id, user.username, user.email, user.role),
      accessToken,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const accessToken = this.signToken(user.id, user.email, user.username, user.role);

    return {
      user: this.toPublicUser(user.id, user.username, user.email, user.role),
      accessToken,
    };
  }

  private signToken(sub: string, email: string, username: string, role: Role): string {
    return this.jwtService.sign({ sub, email, username, role });
  }

  // Formate la réponse pour matcher exactement ce qu'attend le frontend :
  // data.user.roles[0], data.user.username, data.accessToken
  private toPublicUser(id: string, username: string, email: string, role: Role) {
    return {
      id,
      username,
      email,
      roles: [role],
    };
  }
}
