import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.stategy';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RolesEnum, User } from 'src/user/entities/user.entity';
import { Public } from './decorators/public.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, @InjectRepository(User) private readonly userRepo: Repository<User>) {}

  @Public()
  @Post('register')
  register(@Body() data: CreateUserDto & { role?: RolesEnum }) {
    if (!data) {
      throw new BadRequestException(
        'You have to declare user Credentials like: {{name: string, ...}, role: (Optional)}',
      );
    }
    return this.authService.register({ ...data }, data.role);
  }


  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() req: {email: string, password: string}) {
    const user = await this.authService.validateUser(req.email, req.password)
    const findUser = await this.userRepo.findOne({
      where: {email: req.email}
    })
    if (!findUser) {
      throw new NotFoundException('There is no user with email: ' + req.email)
    }
    return this.authService.login(findUser);

  }

  @Post('profile')
  profile(@Request() req) {
    return req.user;
  }
}
