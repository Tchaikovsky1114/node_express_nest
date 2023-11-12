import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/users/entities/user.entity';
import { HASH_ROUND, JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}


  /**
   * 
   * 토큰을 사용하게 되는 방식
   * 1) 클라이언트에서 로그인 / 회원가입 요청시 Basic 토큰과 함께 요청을 보내야한다
   *    ex) {authorization: 'Basic {token}'}
   * 2) 아무나 접근할 수 없는 정보에 접근할 때 at를 Header에 추가해서 요청을 보내야 한다
   *    ex) {authorization: 'Bearer {token}'}
   * 3) 서버는 토큰 검증(verify)을 통해 현재 요청을 보낸 사용자가 누군지 알 수 있게 되고
   *    사용자가 필요로하는 resource를 보내준다.
   *    ex) 현재 로그인 사용자의 게시물만 가져오기 위해 토큰의 sub(id) 값에 입력되어 있는
   *        사용자 게시물만 따로 필터링 할 수 있다.
   * 4) 토큰에는 유효기간이 존재하며 만료될 시 토큰 발급 앤드포인트에 요청하여 새 토큰을 발급받아야 한다.
   * => auth/token/access , auth/token/refresh
   */  
  
  /**
   * 
   * Header로 부터 토큰을 받을 때
   * {authorization: 'Basic {token}'}
   * {authorization: 'Bearer {token}'}
   */
  
  extractTokenFromHeader (header: string, isBearer: boolean) {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    if(splitToken.length !== 2 || splitToken[0] !== prefix ) throw new UnauthorizedException('잘못된 인증토큰입니다.');
    
    const token = splitToken[1];

    return token
  }

  decodeBasicToken(base64String:string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');
    const [email, password] = decoded.split(':')
    
    return { email, password }
  }

  /**
   * 토큰 검증
   * @param token 
   * @returns 
   */
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: JWT_SECRET,
      })  
    } catch (e) {
     throw new UnauthorizedException('토큰이 만료되었거나 존재하지 않습니다.');
    }
    
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token,{
      secret:JWT_SECRET
    })

    /**
     * sub: id
     * email: email,
     * type: 'access' | 'refresh'
     */
    // if(decoded.type !== 'refresh') {
    //   throw new UnauthorizedException('해당 토큰은 Refresh토큰이 아닙니다.')
    // }
    
    return this.signToken({
      ...decoded,
    },isRefreshToken)
  }



  /**
   * 우리가 만드려는 기능
   * 
   * 1) registerWithEmail
   *    - email, nickname, password를 입력받고 사용자를 생성한다.
   *    - 생성이 완료되면 accessToken, refreshToken을 반환한다.
   * 
   * 2) loginWithEmail
   *    - email, password를 받아 사용자를 검증한다
   *    - 검증이 완료되면 accessToken, refreshToken을 반환한다
   * 
   * 3) loginUser
   *    - 1), 2)에서 필요한 accessToken, refreshToken을 반환하는 로직
   * 
   * 4) signToken
   *    - 3)에서 필요한 accessToken, refreshToken을 생성하는 로직
   * 
   * 5) authenticateWithEmailAndPassword
   *    - 2)에서 로그인을 진행할 때 필요한 기본적인 검증 진행할
   *      1. 사용자 존재 확인
   *      2. 비밀번호 확인
   *      3. 사용자 정보 반환
   *      4. loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
   * 
   */

  /**
   * Payload에 들어갈 정보
   * 
   *  1) email
   *  2) sub -> id
   *  3) type -> 'access' | 'refresh'
   */
  signToken(user: Pick<UserModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access'
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300
    })
  }

  loginUser(user: Pick<UserModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    }
  }

  async authenticateWithEmailAndPassword(user: Pick<UserModel, 'email' | 'password'>) {
    // *      1. 사용자 존재 확인 (email)
    // *      2. 비밀번호 확인
    // *      3. 사용자 정보 반환
    const existingUser = await this.usersService.getUserByEmail(user.email);
    if(!existingUser) throw new UnauthorizedException('존재하지 않는 사용자입니다.') // 401
    
    /**
     * 파라미터
     * 
     * 1. 현재 접속한 유저가 입력한 비밀번호
     * 2. 기존 해시 (hash) -> 사용자 정보에 저장되어 있는 해시된 비밀번호
     */
    const passOk = await bcrypt.compare(user.password,existingUser.password);
    if(!passOk) throw new UnauthorizedException('비밀번호가 틀렸습니다');

    return existingUser;
  }

  async loginWithEmail(user: Pick<UserModel, 'email' | 'password'>) {
    
    const existingUser = await this.authenticateWithEmailAndPassword(user);
    return this.loginUser(existingUser);
  }

  async registerWithEmail(user: Pick<UserModel, 'email' | 'nickname' | 'password'>) {
    /**
     * 파라미터
     * 1. 비밀번호
     * 2. 해싱 라운드
     */
    const hash = await bcrypt.hash(user.password, HASH_ROUND);
    const userObj = {
      ...user,
      password: hash
    }
    const newUser = await this.usersService.createUser(userObj);

    return this.loginUser(newUser);
  }
  

  // => 유저 접속 => loginWithEmail => authenticateWithEmailAndPassword(이메일,비밀번호 확인) => loginUser => signToken
}
