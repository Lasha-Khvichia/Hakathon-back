import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  private blacklistedTokens: Set<string> = new Set();

  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: User) {
    const payload = { username: user.name, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  async logout(token: string) {
    if (token) {
      this.blacklistedTokens.add(token);
    }
    return { message: 'Logged out successfully' };
  }

  async register(data: CreateUserDto, role?: RolesEnum) {
    return this.usersService.create(
      { name: data.name, email: data.email, password: data.password },
      role,
    );

  }
}
