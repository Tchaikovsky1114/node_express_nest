import { MaxLengthPipe, MinLengthPipe, PasswordPipe } from './pipes/password.pipe';
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModel } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  postTokenAccess(@Headers('Authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    /**
     * {accessToken: {token}}
     */
    const accessToken = this.authService.rotateToken(token, false)
    return { accessToken }
  }

  @Post('token/refresh')
  postTokenRefresh(@Headers('Authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    /**
     * {refreshToken: {token}}
     */
    const refreshToken = this.authService.rotateToken(token, true)

    return { refreshToken }
  }

  @Post('login/email')
  async postLoginEmail(@Headers('Authorization') rawToken: string){
    const token = await this.authService.extractTokenFromHeader(rawToken,false);
    const user = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(user);
  }

  @Post('register/email')
  postRegisterEmail(
    @Body() user:Pick<UserModel, 'email' | 'nickname'>,
    @Body('password',
    new MaxLengthPipe(20),
      new MinLengthPipe(6, 'password')) password: string
    ){
    return this.authService.registerWithEmail({...user,password});
  }
}
