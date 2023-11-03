
/**
 * 구현할 기능
 * 
 * 1) Request를 불러오고 해더의 Authorization을 추출한다.
 * 
 * 2) authService.extractTokenFromHeader를 이용하여 사용할 수 있는 토큰을 추출한다
 * 
 * 3) authService.decodeBasickToken을 실행해서 Email과 Password를 추출한다.
 * 
 * 4) authService.authenticateWithEmailAndPassword email, password를 이용하여 사용자를 가져온다
 * 
 * 5) 찾아낸 사용자를 (1) 요청 객체에 붙여준다. (어디든지 사용할 수 있게 한다.)
 *    req.user = user;
 */

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";


@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor( private readonly authService: AuthService ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      
      const rawToken = req.headers['Authorization'];

      if(!rawToken) throw new UnauthorizedException('토큰이 존재하지 않습니다.');

      const token = this.authService.extractTokenFromHeader(rawToken, false);

      const { email, password } = this.authService.decodeBasicToken(token);

      const user = await this.authService.authenticateWithEmailAndPassword({email, password})

      req.user = user;

      return true;
  }
}