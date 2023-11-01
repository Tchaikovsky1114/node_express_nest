import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModel } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  loginEmail(@Body() user:Pick<UserModel,'email' | 'password'>){
    return this.authService.loginWithEmail(user);
  }

  @Post('register/email')
  registerEmail(@Body() user: Pick<UserModel, 'email' | 'password' | 'nickname'>){
    return this.authService.registerWithEmail(user);
  }
  
}
