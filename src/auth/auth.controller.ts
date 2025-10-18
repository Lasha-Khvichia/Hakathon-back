import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.strategy';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Post('register')
  register(@Body() body: { data: CreateUserDto; role?: string }) {
    return this.authService.register(
      {...body.data},
      body.role,
    );
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() req: { email: string; password: string }) {
    const user = await this.authService.validateUser(req.email, req.password);
    const findUser = await this.userRepo.findOne({
      where: { email: req.email },
    });
    if (!findUser) {
      throw new NotFoundException('There is no user with email: ' + req.email);
    }
    return this.authService.login(findUser);
  }

  @Post('logout')
  async logout(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    await this.authService.logout(token);
    return { message: 'Logged out successfully' };
  }

  @Post('profile')
  profile(@Request() req) {
    return req.user;
  }
}
