import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModel } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  async loginEmail(@Headers('Authorization') rawToken: string){
    const token = await this.authService.extractTokenFromHeader(rawToken,false);
    const user = this.authService.decodeBasicToken(token);
    console.log('email, password: ',user);
    return this.authService.loginWithEmail(user);

  }

  @Post('register/email')
  registerEmail(@Body() user: Pick<UserModel, 'email' | 'password' | 'nickname'>){
    return this.authService.registerWithEmail(user);
  }

}
