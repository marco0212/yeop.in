---
slug: making-sense-of-react-server-components
title: Making Sense of React Server Components
description: "react server component가 무엇이고 어떻게 동작되는지를 깊게 이해해보자"
tags: [next13, react server component]
createdAt: 2023/11/29
---

> 해당 글은 [https://www.joshwcomeau.com/react/server-components](https://www.joshwcomeau.com/react/server-components) 글을 번역한 포스트입니다. 정확한 내용은 원본을 참조해주세요.

여기 제가 나이가 많아졌다고 느껴지는 사실이 있습니다. 그것은 바로 React가 10번째 생일을 축하했다는 것입니다.

React가 처음 소개되어 개발 커뮤니티를 놀랍게 만든 후 10년간 많은 진화를 거쳤습니다. React 팀은 과감한 변경을 가져갈 때 주저하지 않았습니다. 만약 더 좋은 해결 방법을 찾게 된다면 그들은 함께 문제를 해결하려고 할 것입니다.

몇 달 전, React 팀은 최신 패러다임 쉬프트인 React Server Component를 공개했습니다. 최초로 React 컴포넌트가 서버에서만 동작할 수 있게 되었습니다.

온라인 커뮤니티에서는 이것에 대한 많은 혼란이 있었습니다. 이것이 무엇인지, 어떻게 작동하는지, 이점이 무엇인지, Server Side Rendering과 어떻게 조화를 이룰 수 있는지에 대해 많은 질문이 있었습니다.

저는 React Server Component를 사용해 많은 실험을 해왔고 스스로의 많은 질문에 답했었습니다. 이를 통해 React Server Component가 제가 예상한 것보다 훨씬 더 흥미롭고 멋진 기능이라는 것을 인정하게 되었습니다.

그래서 이 포스트의 목적은 React Server Components에 대해 여러분이 가질 수 있는 많은 질문에 대답해보려고 합니다!

> 대상 독자
>
> 이 글은 이미 React를 사용하고 있고 React Server Components에 대해 궁금한 개발자를 위해 작성되었습니다. React 전문가가 될 필요는 없지만 이제막 React를 시작하였다면 다소 혼란스러울 수 있습니다

## A quick primer on Server Side Rendering

React Server Components를 이해하기 위해 Server Side Rendering(SSR)이 어떻게 동작하는지 이해하는 것이 도움이 될 것입니다. 만약 SSR이 익숙하다면 다음 순서의 글로 넘어가도 무방합니다!

제가 React를 사용하기 시작한 2015년도에는 대부분 `client-side-rendering`을 채택하였습니다. 사용자는 아래와 같은 HTML 파일을 응답 받았었습니다.

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
    <script src="/static/js/bundle.js"></script>
  </body>
</html>
```

`bundle.js`는 어플리케이션을 mount하고 실행하기 위해 react와 서드파티 라이브러리 그리고 우리가 작성한 모든 코드들은 포함하고 있습니다.

일단 JS가 다운로드되고 파싱되면 React가 실행되어 전체 어플리케이션에 대한 모든 DOM 노드를 생성하고 이를 빈 `<div id="root">`에 구성합니다.

이 접근 방식의 문제점은 모든 작업을 수행하는데 시간이 걸린다는 것입니다. 위 일련의 일이 진행되는 동안 사용자는 텅 빈 화면을 바라봐야 합니다. 이 문제는 어플리케이션이 커짐에 따라 악화되는 경향이 있습니다.

우리가 추가한 새로운 기능은 Javascript 번들에 더 많은 코드를 추가하여 사용자가 기다려야 하는 시간을 연장시키게 됩니다.

> 물론 이를 최적화할 수 있는 방법이 존재합니다. 특정 모듈을 lazy-loading 하거나 각 route를 기반으로 code split을 하는 방법 등이 있습니다.
> 하지만 일반적으로 코드가 늘어감에 따라 번들의 사이즈는 점점 늘어가게 될 것입니다.

Server Side Rendering은 이러한 경험을 개선하게끔 설계되었습니다. 텅 빈 HTML 파일을 전달하는 대신, 실제 HTML을 서버에서 생성해서 렌더링되도록 합니다. 그로인해 사용자는 형식이 모두 갖춰진 HTML 문서를 전달받을 수 있습니다.

하지만 React가 클라이언트에서 실행되어야 하기 때문에 여전히 `<script>`태그가 HTML 파일에 포함되어야만 합니다. 하지만 우리는 브라우저 내에서 약간 다르게 동작하도록 React를 구성했습니다. 모든 DOM 노드를 처음부터 만드는 대신 기존 HTML에 활용해 React화 시키도록이요. 이 과정을 `hydration`이라고 합니다.

React 코어 팀 멤버인 Dan Abramov는 다음과 같이 설명했습니다.

> Hydration은 "dry"한 HTML에 상호작용이라는 "물"을 주는 것과 같다

JS 번들이 다운로드 되면 React는 전체 어플리케이션을 빠르게 실행해 가상 UI를 구축하고 이를 실제 DOM에 맞추어 이벤트 핸들러를 연결하고 effect들을 실행하는 등 작업을 수행하게 됩니다.

간단히 설명하자면 이것이 SSR입니다. JS 번들이 다운로드되고 파싱이 되는 동안 사용자가 빈 화면을 바라보지 않아도 되도록 서버는 초기 HTML을 생성합니다. 그리고 클라이언트는 서버에서 미처 해결하지 못한 부분(react화, 상호작용 연결)을 수행합니다.

> 용어
>
> 일반적으로 Server Side Rendering을 이야기할 때 우리는 아래와 같은 흐름을 상상합니다.
>
> 1. 사용자가 사이트에 접속한다.
> 2. Node.js 서버가 요청을 받아 즉시 React 어플리케이션을 렌더링하여 HTML을 생성한다.
> 3. 사용자에게 전달한다.
>
> 이는 물론 Server Side Rendering이지만 이 방식만 있는 것은 아닙니다.
> 다른 옵션은 어플리케이션 빌드 타임에 HTML을 생성하는 것입니다.
>
> 일반적으로 React 어플리케이션은 JSX를 순수한 JS로 가공되어야 하고 모든 모듈을 번들링하는 등 컴파일 작업이 되어야만 합니다. 만약 모든 경로에 대해 모든 HTML을 "pre-rendered" 했다면 어떻게 될까요?
>
> 이것이 일반적으로 알려져 있는 static site generation(SSG)입니다. 이것 또한 Server Side Rendering 방식 중 하나 입니다.
>
> Server Side Rendering은 여러 렌더링 전략을 포함하는 포괄적인 용어입니다. 이들 모두 초기 렌더링은 ReactDOMServer API를 사용해 Node.js와 같은 서버 런타임에서 발생합니다. 어떤 쪽이든 이들은 모두 Server Side Rendering입니다.

## Bouncing back and forth

React에서 이뤄지는 데이터 패치에 대해 이야기 해봅시다. 일반적으로 네트워크를 통해 통신하는 두 개의 별도 어플리케이션이 있습니다.

-> A client-side React App
-> A server-side REST API

React Query나 SWR, Apollo와 같은 것을 사용하면 클라이언트는 백엔드에 요청을 발생시키고 이를 시각화한다면 아래와 같은 그림일 겁니다.

<img width="734" alt="image" src="https://github.com/marco0212/yeop.in/assets/50050459/8f7e9b6c-8f95-4917-b8c7-a32e0ed3b30c" />

이 그림은 Client Side Rendering(CSR)을 사용할 때 나타나는 흐름입니다. 클라이언트가 HTML을 받는 것에서 시작됩니다. 파일은 아무런 컨텐츠가 없지만 몇개의 `<script>` 태그를 가지고 있습니다.

JS 번들이 다운로드되고 파싱되면 React 앱은 수많은 DOM 노드를 생성하고 UI를 채우며 boot up 합니다. 하지만 처음에는 실제 데이터가 없기 때문에 로딩 상태의 shell만 렌더링할 수 있습니다.

아마 이런 페턴을 많이 보셨을 겁니다. 예를 들어 UberEats는 실제 레스토랑을 채우는데 필요한 데이터를 가져오는 동안 shell을 렌더링하는 것으로 시작합니다.

<video controls width="734">
  <source src="https://github.com/marco0212/yeop.in/assets/50050459/2707a9d0-307e-427b-a338-547dcf2d0b23" />
</video>

사용자는 네트워크 요청이 마무리되어 실제 컨텐츠가 로딩 UI를 대체할 때까지 이 로딩 상태의 화면을 보게 될 것입니다.

이를 설계할 수 있는 다른 방법을 살펴봅시다. 다음 그림은 동일한 데이터 패치 패턴을 유지하지만 Client Side Rendering 대신 Server Side Rendering을 사용합니다.

<img width="762" alt="image" src="https://github.com/marco0212/yeop.in/assets/50050459/2fada331-94d1-43f8-a549-a85a8a07196c" />

이 새로운 방식에서는 첫 렌더를 서버에서 수행했습니다. 이것은 유저가 이미 채워져 있는 HTML 파일을 전달 받는다는 것을 의미합니다.

이는 명확한 개선입니다. 텅 빈 페이지보다는 로딩 상태의 화면을 보여주는 것이 더 사용자에게 좋기 때문이죠. 하지만 궁극적으로 유저가 기다려야 하는 것은 여전합니다. 사용자는 로딩 상태의 화면을 보고 싶어서 우리의 앱에 방문하지 않았을테니 말이죠.

사용자 경험의 차이를 파악하기 위해 그래프에 몇가지 성능 지표를 추가해보겠습니다. 두 흐름 사이 어떤 일이 발생하는지 확인해봅시다.

| Rendering Strategy    | Flow                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Client Side Rendering | <img width="677" alt="image" src="https://github.com/marco0212/yeop.in/assets/50050459/3f314e50-b947-4ce6-986c-72423de9a178" /> |
| Server Side Rendering | <img width="677" alt="image" src="https://github.com/marco0212/yeop.in/assets/50050459/2d86439c-5eab-4997-8e7d-bb55984695d2" /> |

위 지표들은 일반적으로 사용되는 웹 성능 지표입니다.

1. First Paint - 유저가 바라보는 화면이 더이상 흰 화면이 아닌 시점. 레이아웃이 그려지지만 여전히 컨텐츠는 없는 상태. 이를 FCP(First Contentful Paint)라고도 부릅니다.
2. Page Interactive - React가 다운로드 되고 우리의 어플리케이션이 렌더/수화되는 때. 엘리먼트들은 이제 상호작용이 가능합니다. 이를 TTI(Time to Interactive)라고 부릅니다.
3. Content Paint - 사용자가 원하는 컨텐츠를 포함해 모든 페이지가 온전히 구성된 때. 데이터베이스에서 꺼내온 정보들이 UI로 모두 렌더링된 상태. 이를 LCP(Largest Contentful Paint)라고 부릅니다.

서버에서 초기 렌더링이 이뤄졌기 때문에 사용자는 shell을 더 빠르게 볼 수 있습니다. 이를 통해 사용자는 진행 상태를 볼 수 있기 때문에 더 좋은 사용 경험을 줄 수 있습니다.

그리고 어떤 상황에서는 이것이 의미있는 개선이 될 수 있습니다. 예를 들어 사용자는 탐색 링크를 클릭할 수 있도록 헤더가 로드되기를 기다리고 있을 수 있습니다.

하지만 조금 이상하지 않나요? SSR 그래프를 보면 요청이 시작된다는 것을 알 수 있습니다. 두 번째 왕복 네트워크 요청을 요구하는 대신 초기 요청에 데이터베이스 작업을 수행하면 어떨까요?

<img width="743" alt="image" src="https://github.com/marco0212/yeop.in/assets/50050459/b379022d-55d0-40eb-9084-0a4cf2040230" />

클라이언트와 서버를 오가는 대신 초기 요청의 일부로 데이터베이스 쿼리를 수행해서 완전히 채워진 UI를 사용자에게 보내도록 말입니다.

하지만 이를 어떻게 할 수 있을까요?

이를 위해서는 React에게 데이터베이스 쿼리와 같은 서버에서만 실행될 수 있는 기능이 있어야 합니다. 하지만 React에게 이러한 옵션은 없죠. 설령 Server Side Rendering이라도 컴포넌트는 서버와 클라이언트 모두에서 렌더링됩니다.

React 생태계는 이에 대한 많은 해결책을 제시했습니다. Next.js와 Gatsby와 같은 다양한 프레임워크들은 서버에서 코드가 실행되는 자체 솔루션을 만들었습니다.

예를 들어 Next.js는 이런 방식으로 사용할 수 있습니다.

```jsx
import db from "imaginary-db";
// This code only runs on the server:
export async function getServerSideProps() {
  const link = db.connect("localhost", "root", "passw0rd");
  const data = await db.query(link, "SELECT * FROM products");
  return {
    props: { data },
  };
}
// This code runs on the server + on the client
export default function Homepage({ data }) {
  return (
    <>
      <h1>Trending Products</h1>
      {data.map((item) => (
        <article key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </article>
      ))}
    </>
  );
}
```

위 코드를 살펴봅시다. 서버가 요청을 받으면 getServerSideProps 함수가 호출되고 props 객체를 반환합니다. 그 후 prop은 컴포넌트에 전달되어 서버에서 먼저 렌더링된 후 클라이언트에서 수화됩니다.

여기서 멋진 점은 `getServerSideProps`가 클라이언트에서 다시 실행되지 않는다는 것입니다. 실제로 이 기능은 번들에도 포함되어 있지 않습니다.

이 접근 방식은 정말 훌륭합니다. 하지만 여기에는 몇 가지 단점이 있습니다.

1. 이 전략은 오직 route 레벨, 모든 컴포넌트의 최상단에서만 작동합니다. 각 컴포넌트들은 이를 사용할 수 없습니다.
2. 각 프레임워크는 각자 다른 방식으로 이를 구현하고 있습니다. Next.js와 Gatsby, Remix 등이 있고 이는 표준화되어 있지 않았습니다.
3. 모든 컴포넌트들은 여전히 클라이언트에서 hydration을 필요로 합니다. 설령 hydration이 필요로 하지 않는 컴포넌트라고 하더라도요.

수년 동안 React 팀은 이 문제를 조용히 해결하기 위해 공식적인 방법을 찾으려고 노력했습니다. 이 솔루션의 이름을 **React Server Component**라고 부릅니다.

## Introduction to React Server Components

높은 추상화 수준에서 React Server Components는 새로운 패러다임의 이름입니다. 이 새로운 패러다임 세상에서 우리는 서버에서 독점적으로 실행되는 컴포넌트를 생성할 수 있습니다. 이로인해 컴포넌트 내부에서 데이터베이스를 조회하는 쿼리를 작성하는 일과 같은 것들을 할 수 있습니다.

"Server Component"를 사용한 예시 코드입니다.

```jsx
import db from "imaginary-db";
async function Homepage() {
  const link = db.connect("localhost", "root", "passw0rd");
  const data = await db.query(link, "SELECT * FROM products");
  return (
    <>
      <h1>Trending Products</h1>
      {data.map((item) => (
        <article key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </article>
      ))}
    </>
  );
}
export default Homepage;
```

수년동안 React를 사용해온 사람으로서 이 코드는 너무 wild 해보였습니다. 😅

"하지만 잠깐만..! 함수형 컴포넌트는 비동기 함수가 될 수 없잖아! 그리고 렌더링 로직에 side effect를 직접적으로 가져서는 안돼!" 저는 경악했습니다.

여기에서 이해해야 할 핵심은 **Server Components는 re-render가 결코 발생되지 않는다는 것**입니다. Server Component는 UI를 생성하기 위해 서버에서 단 한번만 실행됩니다. 렌더링된 값은 클라이언트로 전달되고 이는 lock-in됩니다. React에 의해서는 결코 값이 변경되지 않습니다.

이는 React의 수많은 API가 Server Components와는 호환되지 않는다는 것을 의미합니다. 예를 들어 Server Component는 state를 사용할 수 없습니다. state는 변하지만 Server Component는 re-render가 발생되지 않기 때문이죠. 또 useEffect를 사용할 수 없습니다. effect는 클라이언트에서 렌더링이 된 이후에 한번 발생되지만 Server Component는 결코 클라이언트로 전달되지 않기 때문이죠.

또한 이것은 기존 react의 규칙과 관련해서도 유연함을 가질 수 있다는 것을 의미합니다. 전통적인 React에서는 useEffect 콜백이나 이벤트 핸들러 등 내부에 사이드 이펙트를 넣어서 렌더링될 때마다 발생되지 않도록 해야 했지만 컴포넌트가 단 한번만 호출된다면 더이상 이를 걱정할 필요가 없습니다!

Server Components 자체는 놀라울 정도로 간단하지만 "React Server Component" 패러다임은 꽤 복잡합니다. 우리는 여전히 "일반적인 컴포넌트"를 가지고 있고 서로 결합하는 방식은 혼란을 야기하기 때문이죠.

이 새로운 패러다임에서 우리에게 익숙한 "전통적인 컴포넌트"를 **Client Components** 라고 부릅니다. 사실 저는 이 이름이 마음에 들지는 않습니다. 😅

"Client Component" 라는 이름은 컴포넌트가 클라이언트에서만 렌더링된다는 것을 의미하지만 실제로는 그렇지 않습니다. **Client Component는 클라이언트와 서버 두 곳에서 렌더링됩니다.**

<img width="680" alt="image" src="https://github.com/marco0212/yeop.in/assets/50050459/6adfe12b-9607-49b1-a87d-c24668ca3843"/>

이런 용어들은 꽤 헷갈립니다. 그래서 요약해보겠습니다.

-> React Server Components는 새로운 패러다임을 위한 이름이다.

-> 이 새로운 패러다임 안에서 "표준이었던" React Component는 Client Component라는 이름으로 리브랜딩되었다.

-> 이 새로운 패러다임은 컴포넌트의 새로운 타입인 Server Component를 가지고 나왔고 얘는 서버에서만 독점적으로 실행된다. 이들의 코드는 JS 번들에 포함되지 않고 hydration과 re-render가 결코 일어나지 않는다.

> React Server Components vs. Server Side Rendering
>
> 흔히 혼란스러워 하는 것 중 하나로 React Server Components는 Server Side Rendering을 대체하지 않는다는 것입니다. React Server Components는 "SSR version 2.0"이 아닙니다.
>
> 저는 이것을 완벽하게 결합되는 별개의 퍼즐 조각, 서로를 보완하는 두 가지 맛으로 생각할 수 있다고 봅니다.
>
> 우리는 초기 HTML을 생성하기 위해 여전히 Server Side Rendering에 의존하고 있습니다. React Server Components는 그 위에 구축되어 클라이언트 측 JS 번들에서 특정 컴포넌트만 생략하여 서버에서만 실행되도록 할 수 있습니다.
>
> 실제로 Server Side Rendering 없이 React Server Components를 사용하는 것도 가능하지만 실제로는 함께 사용하면 더 나은 결과를 얻을 수 있습니다. 예를 보고 싶다면 React 팀에서 만든 [minimal RSC demo](https://github.com/reactjs/server-components-demo)를 봐주세요.

## Compatible Environments

보통 React에 새로운 기능이 출시되면 React 의존성을 최신 버전으로 변경하여 기존 프로젝트에 해당 기능을 사용할 수 있습니다. `npm install react@latest`을 실행하면 됩니다.

하지만 React Server Components는 안타깝게도 이런 식으로는 사용할 수 없습니다.

제가 이해한 바에 따르면 React Server Components는 번들러, 서버, 라우터 등 React 외부에 여러 요소들과 긴밀하게 통합되어야만 사용할 수 있습니다.

이 글을 쓰는 동안 React Server Components를 사용하기 위해서는 Next.js 13.4+에서 완전 새롭게 설계된 `App Router`를 사용해야 합니다.

미래에는 더 많은 React 기반의 프레임워크가 React Server Components를 통합하기 시작할 것입니다. React의 기능이 특정 하나의 툴에서만 사용 가능하다는 것은 역시 어색하게 느껴집니다! React 문서에는 React Server Components를 지원하는 프레임워크를 나열하는 "[Bleeding-edge](https://react.dev/learn/start-a-new-react-project#bleeding-edge-react-frameworks)" 섹션이 있습니다. 이 페이지를 확인하며 새로운 옵션이 제공되는지를 확인할 수 있습니다.

## Specifying client components

이 새로운 패러다임 "React Server Components"에서 모든 컴포넌트를 Server Component를 기본으로 간주합니다. Client Component는 옵셔널합니다.

새로운 지시자를 통해 이를 지정할 수 있습니다.

```jsx
"use client";

import React from "react";

function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>Current value: {count}</button>
  );
}

export default Counter;
```

최상단에 'use client'라는 문자열은 이 파일의 컴포넌트가 Client Component이며 클라이언트에서 다시 렌더링할 수 있도록 JS 번들에 포함되어야 함을 React에게 알리는 방법입니다.

컴포넌트의 타입을 명시하는 이러한 방식은 상당히 이상하게 보일 수 있지만 이런 종류의 선례는 있습니다. Javascript에서 "Strict Mode"를 선택하는 "use strict" 지시자입니다.

Server Component를 명시하기 위해서 'use server' 지시문을 사용하지는 않습니다. 새로운 패러다임에서는 React Server Components를 기본 컴포넌트 타입으로 처리합니다. 사실 'use server'는 이 블로그 게시물을 벗어나는 완전히 다른 기능이며 서버 작업 시에 사용될 수 있습니다.

> 어떤 컴포넌트가 Client Component가 되어야 하나요?
>
> 이 글을 보는 당신은 아마 이 컴포넌트가 서버 컴포넌트여야 하는지 클라이언트 컴포넌트어야 하는지 어떻게 결정해야 할지 궁금할 수 있습니다.
>
> 일반적으로 그것이 서버 컴포넌트일 수 있다면 그것은 서버 컴포넌트여야 할 것입니다. Server Component는 추론하기가 간단하고 쉬운 경향이 있습니다. 성능상의 이점도 있고요. Server Component는 클라이언트에서 실행되지 않기 때문에 해당 코드가 Javascript 번들에 포함되지 않습니다. React Server Components 패러다임의 장점 중 하나는 Page Interactive(TTI) 측정 항목을 향상시킬 잠재력이 있다는 것입니다.
>
> 이 말이 모든 Client Component를 근절시키는 것을 목표로 해야 한다는 것은 아닙니다! 최소한의 Client Component로 최적화하려고 해서는 안됩니다. 지금까지 모든 React 앱의 컴포넌트는 Client Component였다는 점을 기억할 필요가 있습니다.
>
> React Server Components를 사용하면 매우 직관적이라는 것을 알 수 있을 겁니다. 어떤 컴포넌트는 state와 effect를 사용하기 때문에 'use client' 지시문을 작성해서 클라이언트에서 실행되도록 해야 할 것입니다. 그런 경우가 아니라면 Server Component로 남겨둘 수 있습니다.
