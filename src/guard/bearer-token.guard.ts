import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "src/users/users.service";


@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
    ){}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    
    const rawToken = req.headers['authorization'];

    if(!rawToken) throw new UnauthorizedException('토큰이 없습니다.')

    const token = this.authService.extractTokenFromHeader(rawToken,true);
    const result = await this.authService.verifyToken(token);
    const user = await this.usersService.getUserByEmail(result.email)
    
    req.token = token;
    req.tokenType = result.type;
    req.user = user;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    
    const req = context.switchToHttp().getRequest();

    if(req.tokenType !== 'access') throw new UnauthorizedException('해당 토큰은 엑세스토큰이 아닙니다');

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);

      const req = context.switchToHttp().getRequest();

      if(req.tokenType !== 'refresh') throw new UnauthorizedException('해당 토큰은 리프래시 토큰이 아닙니다.')
    return true
  }
}