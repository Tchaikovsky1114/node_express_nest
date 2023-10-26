## 메모

### Nodejs
싱글스레드인 노드는 이벤트 루프를 통해 논블로킹 요청은 처리하여 프론트로,
블로킹 요청은 워커 스레드로 보내며 마치 멀티스레드와 같이 움직인다!

### URL의 구성요소

https://blog.codefactory.ai/javascript?page=1

- Scheme (https://)
- Domain (blog.codefactory.ai) 
- Path (/javascript)
- Query Parameter (?page=1)


### Nestjs

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


### DOCKER

POSTGRESQL: Add Connection으로 VSCODE 내에서 DB 매니징이 가능하다.
IP : 로컬(127.0.0.1)
root: DATABASE_USER
password
port
