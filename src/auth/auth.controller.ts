import { Body, Controller, Headers, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from '../guard/basic-token.guard';
import { AccessTokenGuard, RefreshTokenGuard } from '../guard/bearer-token.guard';
import { RegisterUserDto } from './dtos/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @UseGuards(AccessTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    /**
     * {accessToken: {token}}
     */
    const accessToken = this.authService.rotateToken(token, false)
    return { accessToken }
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    /**
     * {refreshToken: {token}}
     */
    const refreshToken = this.authService.rotateToken(token, true)

    return { refreshToken }
  }

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  // @Request() BasicTokenGuard 덕분에 req에는 user 프로퍼티가 존재하게 된다.
  postLoginEmail(
    @Headers('authorization') rawToken: string,
    ){
    
    const token = this.authService.extractTokenFromHeader(rawToken,false);
    
    const user = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(user);
  }

  @Post('register/email')
  postRegisterEmail( @Body() user: RegisterUserDto){
    return this.authService.registerWithEmail(user);
  }
}
