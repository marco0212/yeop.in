---
slug: react-server-component
title: React Server Component 맛보기
description: "Next.js 13 버전에서 새롭게 소개된 Server Component에 대해서 알아보자"
tags: [next13, react server component]
createdAt: 2023/10/04
---

## 들어가며

실제 웹 서비스를 구현할 때에는 사용자 인터페이스와 백엔드 기능 뿐 아니라 성능, SEO, 확장성과 개발자 경험까지 고려해야 할 요소들이 아주 많이 있다. 이러한 많은 기능들을 모두 직접 구현하기란 다소 복잡하고 반복되는 부분이 존재한다. 그렇기 때문에 이미 잘 만들어져 있는 boilerplate를 사용하고는 하는데 현 시점 가장 널리 사용되고 큰 규모의 커뮤니티를 가진 도구는 단연 React를 기반으로 확장된 framework, `Next.js`가 있다.

최근 내가 일하는 팀에서 Next.js 버전 업그레이드를 진행하며 이 새로운 기능, Server Component에 대한 호기심이 생겼고 이를 학습하고 정리하기 좋은 기회라고 생각했다. 비록 버전이 릴리즈된지 시간이 꽤 지나 벌써 13.5 버전이 릴리즈된 시점이지만, 그리고 현 조직에 이 새로운 기능을 적용시키기에 적합한지에 대해 여전히 물음표지만 Next.js를 사용하는 유저로서 Next.js의 동태와 지향점을 파악하는 것은 필요하다고 생각되기 때문에 충분히 가치있다고 판단된다.

## React Server Component

React Server Component(Server Component)는 이미 2020년 React Blog, [Introducing Zero-Bundle-Size React Server Components](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html?)에서 소개된 바가 있다. 당시 데모 코드와 현재 Next.js에서 제공하는 Server Component와는 구체적인 컨벤션과 인터페이스에 차이가 있지만 큰 맥락에서는 동일하기 때문에 위 글을 먼저 참고하면 이해하는데 도움이 될 것이다.

### Server Component? Server Side Rendering?

우선 새로운 개념인 Server Component에 대해 알아보기 이전에 무엇이 Server Component가 아닌지를 명확하게 하는게 좋을 것 같다.
내가 Server Component에 대한 글을 읽고 처음 들었던 생각은 `Next.js를 사용하면 서버 사이드에서 컴포넌트를 렌더링 하는데 그럼 기존의 것은 서버 컴포넌트가 아닌거야?` 였다. 이에 대한 대답은 `기존의 것은 서버 컴포넌트가 아니다` 이다.

기존 Next.js에서 동작하던 Server Side Rendering은 Server Component와 얼핏 보기에 비슷한 것으로 보이기도 한다. Server Component는 클라이언트가 아닌 서버에서 가공되고 처리되는 컴포넌트일텐데 이미 SSR을 통해 서버에서 컴포넌트가 pre-rendering되고 있지 않은가.

이는 대조되는 개념들을 활용해 정리하는 것이 좋을 거 같다.

Server Component는 용어에서 유추할 수 있듯이 서버에서 가공되고 렌더링되는 컴포넌트를 뜻한다. Server Component는 서버에서 작성하고 그 결과물을 클라이언트로 전달된다. 다시말해 이미 rendering이 되기 완전한 상태의 결과물이기 때문에 클라이언트는 서버 컴포넌트 내부에 대해 전혀 알 수 없다. 그에 반해 Client Component(기존 Next.js에서 렌더링되던 모든 컴포넌트)는 pre-rendering 시점에 서버에 의해 HTML로 생성되기는 하지만 HTML과 함께 전달된 js 번들 파일에 의해 수화과정을 거쳐야만 온전한 컴포넌트로 렌더링이 될 수 있다.

결국 Server Side Rendering(pre-rendering)은 Server Component, Client Component 모두에 적용되는 Next.js의 기본 동작인 것이고 Server Component는 기존의 Client Component와 기능, 동작, 특징이 모두 다른 완전 새로운 것이라고 정리할 수 있겠다.

### Benefits of Server Component

그럼 이제 본격적으로 Server Component의 이점에 대해서 이야기를 해보자.

**Fetching data inside the component**

Server Component는 서버에서 작성되기 때문에 컴포넌트 레벨에서 직접적으로 데이터 소스(데이터베이스, 파일시스템 등)에 접근할 수 있게 된다.

```tsx
export async function ServerComponent() {
  const posts = await PostsModel.find();

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
```

13 버전 이전에는 서버 사이드에서 데이터를 컴포넌트에 미리 채우고 싶을 때 반드시 페이지 레벨에서 `getStaticProps`, `getServerSideProps`과 같은 data fetching 메서드를 사용해야 했는데 Server Component를 사용한다면 과도한 prop drilling을 방지할 수 있고 컴포넌트의 의존성을 더 자유롭게 관리할 수 있다.

이렇게 서버에서 요청하는 것은 개발 경험을 좋게 만들어 줄 뿐 아니라 사용자에게도 이점을 가져다줄 수 있다. 우선 클라이언트에서 처리할 요청의 수를 줄일 수 있고 데이터 센터와 더 가까운 레이어에서 요청을 주고 받기 때문에 더 빠르게 사용자에게 노출될 수 있다. 또한 token이나 api key와 같은 민감한 데이터들 또한 클라이언트에 노출될 우려가 없기 때문에 보안성에도 이점을 갖는다고 할 수 있다.

**Reduce bundle size**

Server Component를 사용하면 번들 파일 사이즈를 유의미하게 줄일 수 있다.

번들 파일은 무엇일까?

일반적으로 Next.js를 통해 렌더링될 때는 pre-rendering 과정에서 생성된 결과물 HTML과 js 파일을 응답으로 받게 된다. HTML은 브라우저에서 UI를 그저 표시하기 위한 목적으로 미리 만들어진 결과물이기 때문에 사용자에게 UI를 보일 수는 있어요 클릭이나 각종 인터렉션은 불가능한 상태이다. 이런 불완전한 상태의 컴포넌트를 완전하게 만들어주기 위해서는 수화(hydration) 과정이 필요한데 이 과정을 처리해 주는 것이 번들 파일이다.

기존의 Client Component는 번들 파일에 의해 온전한 컴포넌트로 처리 과정을 거쳐야 하기 때문에 컴포넌트가 의존하는 모든 js 파일들이 번들에 포함되어야만 한다.

<!-- Image: Screenshot of source tab including dependency packages, component, util functions etc. -->

이 번들에는 사용된 컴포넌트와 각종 함수들을 포함해 컴포넌트가 의존하는 여러 라이브러리들까지 포함되어야 한다. 즉 pre-rendering된 결과물과는 별개로 컴포넌트를 온전하게 만들기 위해서는 js 번들 파일에 의해 후속 처리가 되어야 한다는 말이다.

하지만 그에 반해 Server Component는 서버에서 이미 온전한 상태의 결과물로 클라이언트에 전달되기 때문에 컴포넌트가 의존하는 라이브러리나 코드가 번들에 포함되지 않는다. 이로인해 번들 사이즈는 크기가 꽤 줄어들 수 있다. 이는 느린 인터넷을 사용하는 유저나 모바일과 같은 디바이스가 요청할 때 좋은 경험을 제공할 수 있게 된다.

## 마치며

이번 Next.js의 Server Component를 학습하며 예전에 사용했던 php나 Node.js의 템플릿 엔진과 유사한 거 같다는 느낌을 물씬 느꼈다. 과거 Jquery를 사용해 웹 개발을 하다 React와 같은 UI 라이브러리의 등장으로 패러다임이 완전히 바뀌었다고 생각했었는데 다시 Server Side Rendering으로 변화했고 특히 이번 Server Component는 꽤 과거와 유사한 방식으로 또 변화하고 있는 것처럼 보였다. 이러한 현상을 보니 `아 기술의 큰 흐름은 계속 도는구나` 그리고 `현재 문제의 솔루션은 어쩌면 과거에 있을 수 있겠구나` 하는 생각이 드는 시간이었다.

> Times are evolving, things get better. Even though it might look like things are oscillating back and forth, they are, in fact, moving forward:
