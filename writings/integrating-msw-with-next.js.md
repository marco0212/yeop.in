---
slug: integrating-msw-with-next.js
title: Next.js에 msw 적용하기
description: "Next.js 프로젝트에 api 모킹 라이브러리 msw를 어떻게 적용시킬 수 있는지 알아봅시다."
tags: [next.js, msw, service worker]
createdAt: 2024/01/10
---

## 들어가며

클라이언트 개발 중 병목이 발생하는 대표적인 케이스로 서버 API가 개발이 완료되지 않은 경우가 있다. 이상적으로 서버 작업이 모두 마무리된 이후에 클라이언트 개발이 진행된다면 좋겠지만 항상 그럴 수는 없다. 만약 이런 상황에 대처할 수 있는 시스템이 있다면 클라이언트 작업이 도중에 중단되지 않을 수 있기 때문에 더 빠르고 효과적으로 작업을 진행할 수 있을 것이다. 이번 포스트에서는 Next.js 프로젝트에서 MSW(Mock Service Worker)를 활용해 모킹 시스템을 구축했던 과정을 살펴보고 이를 어떻게 적용시켰는지 알아보자

> **NOTE**
>
> Next.js 14+ 버전으로 진행하지만 App router가 아닌 Page router 프로젝트를 기준으로 진행합니다. Server Component에서 사용하기 위한 방법은 다른 포스트를 참고해주시기 바랍니다.

## MSW (Mock Service Worker)

Mock Service Worker는 이름에서 유추할 수 있다시피 Service Worker를 활용해 구현한 Mocking library이다. Service Worker는 브라우저에서 동작하는 새로운 컨텍스트이다. 브라우저의 메인 스레드가 아닌 별도 스레드에서 실행되는 특징을 가지고 있기 때문에 Service Worker에서 실행되는 연산이 UI 렌더링에 영향을 주지 않는 특징을 가지고 있다. 또한 브라우저에서 발생되는 네트워크 요청을 캐치하고 핸들링할 수도 있다. 이런 다재다능한 Service Worker를 기반으로 구현된 Mocking 툴이 MSW이다.

### Setup

먼저 MSW를 설치할 Next.js 프로젝트를 생성해 기본적인 환경을 구축해야 한다. Next.js의 13버전 이상부터는 서버 컴포넌트를 활용할 수 있지만 이번 아티클에서는 클라이언트 컴포넌트, 즉 Page Router에서 MSW를 적용할 것이기 때문에 프로젝트 생성 시 이에 맞는 설정을 해야 한다.

```vim
$ npx create-next-app@latest

What is your project named? mocking-with-msw (Whatever you want)
Would you like to use TypeScript? Yes (Whatever you want)
Would you like to use ESLint? Yes (Whatever you want)
Would you like to use Tailwind CSS? Yes (Whatever you want)
Would you like to use `src/` directory? No (Whatever you want)
Would you like to use App Router? (recommended) No (No!!! I'll use page router)
Would you like to customize the default import alias (@/*)? No (Whatever you want)
What import alias would you like configured? @/* (Whatever you want)
```

프로젝트 설정을 마치고 필요한 의존성을 모두 설치하였다면 msw 적용을 확인할 수 있도록 API를 호출하는 간단한 어플리케이션을 구축해보자.
어플리케이션의 모습은 아래와 같다. 선택한 버튼에 따라 각 성별의 유저를 렌더링하는 간단한 어플리케이션이다.

<img width="635" alt="image" src="https://github.com/marco0212/yeop.in/assets/50050459/f657f097-5944-4f06-8fb0-3f6a06b11c5c">

서버와 논의를 통해 유저를 조회하는 API의 end point는 `/api/users`로 정하게 되었다고 가정해보자. api는 gender를 파라미터로 받을 수 있도록 구현된다고 한다.
이를 구현한다면 아래와 같은 코드가 될 것이다.

```tsx
type GenderType = "female" | "male";

type UserType = {
  id: number;
  name: string;
  email: string;
  gender: GenderType;
  ...
};

export default function Home() {
  const [gender, setGender] = useState<GenderType>("female");
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    fetch(`/api/users?gender=${gender}`)
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, [gender]);

  return (
    ...
  );
}

```

현재까지 작성된 코드를 브라우저에 확인해본다면 유저 조회 요청에서 404 에러가 발생되고 있을 것이다. 당연하다. 서버와 논의해 end point는 결정되었지만 아직 서버 작업이 배포되어 있지 않아 해당 API를 사용할 수 없기 때문이다. 이를 해결하기 위해 MSW를 활용해 모킹 시스템을 구축해보자.

```vim
$ yarn add msw@1.3.2 --dev
$ npx msw init ./public
```

> **NOTE**
>
> 현 시점 기준 MSW의 메이저 버전은 2.x.x까지 릴리즈가 되었지만 [v2는 next13+ 을 지원하지 않아](https://github.com/mswjs/msw/issues/1805#issuecomment-1803615487) 사용할 수 없는 것으로 파악되었습니다. 그래서 v1 중 가장 최신 버전인 1.3.2 버전을 설치합니다

msw를 설치하고 `mockServiceWorker.js` 파일을 생성했다면 응답 핸들러와 워커 생성 코드를 작성해보자.

```ts
// src/mocks/handler.js

import { rest } from "msw";

export const handlers = [
  rest.get("/api/v1/users", (req, res, ctx) => {
    const { gender } = Object.fromEntries(new URLSearchParams(req.url.search));

    if (gender === "male") {
      return res(
        ctx.status(200),
        ctx.json([{ id: 1, name: "Tom", gender: "male" }])
      );
    }

    return res(
      ctx.status(200),
      ctx.json([{ id: 2, name: "Alice", gender: "female" }])
    );
  }),
];
```

```ts
// src/mocks/browser.js

import { setupWorker } from "msw";
import { handlers } from "./handler";

export const worker = setupWorker(...handlers);
```

끝으로 Next.js 어플리케이션이 실행될 때 MSW가 실행될 수 있도록 _app.tsx 파일에 호출 코드를 추가한다

```tsx
// _app.tsx

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  import("@/mocks/browser").then(({ worker }) => {
    worker.start();
  });
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

```
하지만 확인해보니 여전히 404 에러가 발생되고 있다. 

<img width="924" alt="image" src="https://github.com/marco0212/yeop.in/assets/50050459/ef818392-81f6-4647-9176-93b4590fc30d">

이유는 실행 순서에 있다. API를 모킹하기 위해서는 worker 모듈을 불러오고 start 메서드가 호출된 이후에 api를 호출해야 하는데 현재는 실행 순서가 보장이 되지 않고 있기 때문에 초기 페이지 렌더링에서 호출하는 API를 모킹이 적용되지 않는 것이다. 이를 해결하기 위해서는 mocking이 활성화된 이후에 API를 호출할 수 있도록 처리를 해주어야 한다.

mocking이 활성화된 이후에 API를 호출하도록 처리하기 위해서는 새로운 컴포넌트를 만들어야 한다. 조건에 따라 데이터 패칭(hook)을 호출하도록 조정해야 하기 때문이다.

```tsx
// mocks/MswConfig.tsx

export default function MswConfig({ children }: { children: ReactElement }) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const [enableMsw, setEnableMsw] = useState(false);

  useEffect(() => {
    import("./browser")
      .then(({ worker }) => {
        return worker.start({
          onUnhandledRequest: "bypass",
        });
      })
      .then(() => {
        setEnableMsw(true);
      });
  }, []);

  if (!isDevelopment) {
    return children;
  }

  if (enableMsw) {
    return children;
  }

  return null;
}
```

```tsx
// _app.tsx

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MswConfig>
      <Component {...pageProps} />
    </MswConfig>
  );
}

```

이후 다시 브라우저를 확인해본다면 유저 조회 API 모킹이 잘 동작하는 것을 확인할 수 있다. worker 모듈을 불러오고 start 메서드가 실행된 이후에야 `enableMsw` 상태가 true로 변경되기 때문에 msw 실행 이후 API를 호출하도록 순서가 보장이 되었기 때문이다.

> **NOTE**
>
> Next.js에서 위의 `MswConfig` 컴포넌트와 같이 상위에서 렌더링을 막는 작업을 할 때에는 주의가 필요하다. Next.js는 빠른 초기 렌더링을 위해 pre-rendering 단계에서 html을 구축하게 되는데 null을 반환하게 될 경우 텅 빈 결과물을 html로 반환하기 때문에 ssr을 통한 성능적 이점을 누리지 못할 가능성이 있기 때문이다.

## Conclusion

최근 조직내에 MSW를 사용해 모킹 시스템을 구축하게 되었다. 간단한 작업이었지만 각 개발 환경에서 mocking 데이터가 충돌하지 않게 하기 위한 형상 관리 관련 정책 논의나 pre-rendering에 영향을 주지 않게 하기 위한 처리 등 신경 써야 할 요소들이 꽤 있는 일감이어서 정리를 해두고 싶다는 생각이 들게 되었다. 

이제 더이상 서버 개발자에게 API 언제 배포되냐고 묻지 않아도 되어 기쁘다.
