import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.stategy';
import { JwtAuthGuard } from './jwt.strategy';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: { data: CreateUserDto; role?: string }) {
    return this.authService.register(
      {...body.data},
      body.role,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: User) {
    return this.authService.login(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  profile(@Request() req: User) {
    return req;
  }
}
