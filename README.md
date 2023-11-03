# 메모

## Nodejs
싱글스레드인 노드는 이벤트 루프를 통해 논블로킹 요청은 처리하여 프론트로,
블로킹 요청은 워커 스레드로 보내며 마치 멀티스레드와 같이 움직인다!

### URL의 구성요소

https://blog.codefactory.ai/javascript?page=1

- Scheme (https://)
- Domain (blog.codefactory.ai) 
- Path (/javascript)
- Query Parameter (?page=1)


## Nestjs

express를 클린하게, 모두가 같은 컨밴션으로 코드를 작성하기 위해
Inversion of Control, Dependencies Injection 아키텍쳐를 적용한
express의 프레임워크이다.
nest 프로젝트를 생성함과 동시에 IOC(Inversion Of Control) 컨테이너가 생성되는데
IOC 컨테이너가 필요한 클래스 인스턴스를 생성하고, 필요한 클래스 라이프 사이클을 제어한다.
만약 IOC 컨테이너가 관리하고 있는 클래스의 인스턴스를 필요로하는 다른 클래스가 있는 경우
개발자가 제어할 필요 없이 IOC 컨테이너가 자동으로 생성된 인스턴스를 주입한다
이러한 아키텍쳐는 테스트하는데에도 매우 큰 장점이 되는데,
인스턴스를 생성하는 과정이 없기 때문에 생략이 가능하기 때문이다.


```ts

export class SomeController {
  
  // FooService: SomeCotroller의 Provider - FooService
  constructor(private readonly fooService:FooService) {} 

}
```
**의존성을 주입 받는 클래스와 Provider**

모듈에서 클래스를 인스턴스화 하지 않고, 클래스를 의존성 배열에 넣는 이유는
IoC 컨테이너가 해당 클래스를 자동으로 인스턴스화하고 관리하는 것을 원하기 때문이다.
모듈 파일 내부의 `@Module` 데코레이터의 `providers` 프로퍼티에는 위 `fooService`처럼
인스턴스화하여 주입할 클래스를 명시하여 IoC가 해당 클래스의 라이프사이클을 제어할 수 있게 만들어 준다.
++ `providers` 프로퍼티에 명시한 클래스는  반드시 해당 클래스를 작성한 곳에서 `@Injectable()` 데코레이터를 달아주어야만 프로바이더로서 사용할 수 있다.

즉 IoC에게 의존하여, 제어의 흐름을 개발자가 아닌 Nest가 담당하는 제어의 역전 현상이 일어난다.

___

각각의 모듈을 불러오는 App Module, 그리고 App Module을 불러오는 `main.ts`의 `bootstrap()`



RESOURCE 키워드를 통한 mocos생성
- nest g resource





INSERT INTO {table} {column1, column2, ...} VALUES {value1, value2, ...}


## DOCKER

POSTGRESQL: Add Connection으로 VSCODE 내에서 DB 매니징이 가능하다.
IP : 로컬(127.0.0.1)
root
password
port

## Session

유저의 정보를 저장하고 상태를 유지하기 위한 도구이다.

Session은 특수한 ID값으로 구성되어있다.
Session은 **서버에서 생성**되며 클라이언트에서 **쿠키를 통해 저장**된다.

클라이언트에서 요청을 보낼 때 Session ID를 같이 보내면
서버에서 ID를 확인하여 사용자가 누구인지 알 수 있게 된다.
=> 요청할 때마다 매번 사용자의 아이디와 비밀번호를 물어볼 필요가 없게 된다.

서버에서 데이터가 저장되기 때문에 클라이언트에 사용자 정보가 노출될 위험이 없다.

단점: Session ID는 DB에 저장되기 때문에 요청이 있을 때마다 매번 DB를 확인해야하므로
Horizontal Scaling이 어렵다.
=> 리소스적인 단점이 있다.


## JWT


`Header`, `Payload`, `Signature`로 구성되어 있으며, BASE64로 인코딩된 문자열로 이루어진 토큰이다.

JWT은 서버에서 생성하여 클라이언트에서 저장된다.

JWT는 DB에 저장하지 않고 Signature값을 이용하여 검증할 수 있다.

정보가 모두 토큰에 담겨있는 부분과, 클라이언트가 토큰을 저장하는 부분으로 인해 정보 유출 위험이 있다.

### JWT - Refresh Token & Access Token

Access Token은 검증용 토큰으로 인증이 필요한 API를 사용할 때 사용된다.
Refresh Token은 Access Token을 새로고침 하는 기능을 하며 Access Token을 추가로 발급할 때 사용된다.
Access Token은 유효기간이 짧고, Refresh Token은 유효기간이 길다.(보안상)

### bcrypt
느리다 그래서 보안에 좋다.



## Session VS JWT

정보 저장의 주체 : 서버 
|비교요소|Session|JWT|
|------|---|---|
|정보 저장의 주체|서버|클라이언트|
|요청시 서버로 보내는 정보|쿠키|토큰|
|DB 의존성|의존적|비의존적|
|탈취 가능성|낮음|높음|
|Horizontal Scaling|어려움|쉬움|


## 서비스는 모듈에 의존성을 갖는다.

**`@Module` 데코레이터에 인자로 전달하는 객체의 내부 프로퍼티인 providers의 값으로 들어있는 의존성 배열의 요소들은 `@Module` 데코레이터가 적용된 모듈에서만 사용할 수 있다**

```ts
@Module({
  imports: [],
  controller: [],
  providers: [] // 다른 모듈에서는 사용이 불가능하다.
})
export class FooModule{}
```

만약 다른 모듈에서의 사용을 희망한다면 따로 `export` 프로퍼티에 명시해주어야 한다

```ts
@Module({
  imports: [],
  exports: [], // ++
  controller: [],
  providers: []
})
```




## 토큰 관리 방법

클라이언트가 토큰을 발급, 갱신 할 수 있는 라우트는 총 4가지이다.

1. 회원가입할 때
2. 로그인할 때
3. AccessToken이 만료되었을 때
4. RefreshToken이 만료되었을 때

먼저 회원가입부터 알아보자.

```ts
// auth.controller.ts
  @Post('register/email')
  postRegisterEmail(@Body() user: Pick<UserModel, 'email' | 'password' | 'nickname'>){
    return this.authService.registerWithEmail(user);
  }
```
유저는 회원가입 폼을 작성한 뒤 서버로 보낸다. 
작성된 폼은 서비스의 `registerWithEmail`을 호출하며 인자로 보낸다.

`registerWithEmail`
```ts
// auth.service.ts
  async registerWithEmail(user: Pick<UserModel, 'email' | 'nickname' | 'password'>) {
    const hash = await bcrypt.hash(user.password, HASH_ROUND);
    const userObj = {
      ...user,
      password: hash
    }
    const newUser = await this.usersService.createUser(userObj);

    return this.loginUser(newUser);
  }
```
`registerWithEmail`의 역할
1. 사용자의 비밀번호를 해싱한다.
2. 해싱된 비밀번호와 함께 회원가입 폼을 `userService`의 `createUser` 메서드의 인자로 보내고 일련의 처리를 진행한다.
3. 처리된 유저정보를 `loginUser` 함수의 인자로 보낸다.


2번의 `userService.createUser`는 다음과 같다.

```ts
// user.Service.ts
async createUser(user: Pick<UserModel,'email' | 'password' | 'nickname'>) {
    
    const existEmailAndNickname = await this.userRepository.exist({
      where: [ { email: user.email }, { nickname: user.nickname} ]
    })
    
    if(existEmailAndNickname) throw new BadRequestException('이메일 또는 닉네임이 존재합니다.');
    
    const userObj = this.userRepository.create({
      nickname: user.nickname,
      password: user.password,
      email: user.email
    });

    const newUser = await this.userRepository.save(userObj);

    return newUser
  } 
```
`createUser`는 `loginUser`메서드 실행 이전에 회원정보를 validation 후 DB에 저장하고
그 저장된 값을 리턴하는 함수이다.


그 값을 가지고 `loginUser`로 들어가면 본격적으로 토큰에 관련된 로직들이 실행된다.
```ts
  loginUser(user: Pick<UserModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    }
  }

```

이 역시 추상화 되어 있어 정확히 무엇을 하는지는 파악이 어렵지만, `signToken` 메서드를 2번 호출한 값을
accessToken, refreshToken 프로퍼티에 담아 객체로 반환하며 loginUser는 종료된다.

알아보기 이전에 다시 한 번 짚어보자면 `loginUser`가 받는 매개변수 `user`는 `createUser`를 통해 실제 DB에 기록된 유저의 정보다.
회원가입 폼에는 `id`가 없었지만, db에 기록되고 나서부터는 `id`를 부여받기 때문에 `id`를 `Pick`할 수 있다.

accessToken에는 2번째 인자로 false를 전달하는 `signToken`을,
refreshToken에는 2번째 인자로 true를 전달하는 `signToken`을 실행한다.

그럼 이제 `signToken`에 대해 알아보자

```ts

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

```
먼저 return하는 값을 보면,
jwtService의 sign 메서드를 사용하여 토큰을 생성하는데, 총 2개의 인자를 전달한다.
1번째 인자인 `payload`는 JWT를 구성하는 재료다.
추후 토큰을 decoding하여 정보로서 사용할 수 있어야 하기 때문에 `payload`에는 무작위 값을 넣을 수 없다.
2번째 인자는 options이며 여러가지 옵션 중 `secret`은 JWT를 생성하는 곳에 같이 입력되는 값이며 expiresIn은 토큰의 유효기간이다.

`payload.type`과 `sign`메서드의 2번째 인자인 `expiresIn`의 값은 삼항연산자로
2번째 인자인 `isRefreshToken`에 따라 각각 다른 값이 들어오게 되고, 토큰의 형태 또한 달라지게 된다.


즉 클라이언트측에서 유저가 회원가입을 하면,
1. 사용자 비밀번호 해싱
2. 해싱 정보와 함께 DB에 저장
3. DB에 저장된 유저 레코드를 가져와 at,rt 생성
4. 유저에게 전달

로직 순으로 진행된다.

```ts
@Post('token/access')
  postTokenAccess(@Headers('Authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const accessToken = this.authService.rotateToken(token, false)
    return { accessToken }
  }

  @Post('token/refresh')
  postTokenRefresh(@Headers('Authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
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
  postRegisterEmail(@Body() user: Pick<UserModel, 'email' | 'password' | 'nickname'>){
    return this.authService.registerWithEmail(user);
  }
  ```

  ```ts
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
    return this.jwtService.verify(token, {
      secret: JWT_SECRET,
    })
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
    if(decoded.type !== 'refresh') {
      throw new UnauthorizedException('토큰 재발급이 불가능합니다.')
    }
    
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
```


## Pipes

변형하고, 검증하는 로직.

컨트롤러에 들어가기 이전에 값을 변형하고, 잘못된 값이라면 Exception을 던질 수도 있다.


### built in Pipes

ValidationPipe
ParseIntPipe
PArseFloatPipe
ParseUUIDPipe
parseEnumPipe
...

커스텀도 가능하다

### 커스텀파이프 만들어보기

```ts
@Injectable()
export class PasswordPipe implements PipeTransform {

  transform(value: any, metadata: ArgumentMetadata) {
    
    if(value.toString().length < 8) {
      throw new BadRequestException('비밀번호는 8자 이상 입력해주세요')
    } 
    return value.toString();
  }
}


@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(
    private readonly length: number,
    private readonly target: string,
    ) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if(value.toString().length < this.length) {
      throw new BadRequestException(`${this.target}의 최소 길이는 ${this.length} 입니다.`)
    }  

    return value.toString();
  }
}
```
