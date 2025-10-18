import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // or 'username' depending on what you're using
    });
  }

  async validate(username: string, password: string): Promise<any> {
    return this.authService.validateUser(username, password);
  }
}

@Injectable()
export class LocalAuthGuard extends PassportStrategy(Strategy, 'local-guard') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Specify the field name you're using
    });
  }

  async validate(username: string, password: string): Promise<any> {
    return this.authService.validateUser(username, password);
  }
}
