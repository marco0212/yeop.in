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
> Next.js 13+ 버전으로 진행하지만 App router가 아닌 Page router 프로젝트를 기준으로 진행합니다. Server Component에서 사용하기 위한 방법은 다른 포스트를 참고해주시기 바랍니다.

## MSW (Mock Service Worker)

Mock Service Worker는 이름에서 유추할 수 있다시피 Service Worker를 활용해 구현한 Mocking library이다. Service Worker는 브라우저에서 동작하는 새로운 컨텍스트이다. 브라우저의 메인 스레드가 아닌 별도 스레드에서 실행되는 특징을 가지고 있기 때문에 Service Worker에서 실행되는 연산이 UI 렌더링에 영향을 주지 않는 특징을 가지고 있다. 또한 브라우저에서 발생되는 네트워크 요청을 캐치하고 핸들링할 수도 있다. 이런 다재다능한 Service Worker를 기반으로 구현된 Mocking 툴이 MSW이다.

