import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RolesEnum, User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  private blacklistedTokens: Set<string> = new Set();

  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByUsername(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  login(user: User) {
    if (!user) {
      throw new UnauthorizedException('No user found');
    }
    const payload = { username: user.name, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }


  async register(data: CreateUserDto, role?: RolesEnum) {
    return this.usersService.create(
      { name: data.name, email: data.email, password: data.password },
      role,
    );
  }
}
