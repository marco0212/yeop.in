---
slug: avoid-reflow-and-repaint
title: Avoid Reflow & Repaint
description: "DOM 조작 시 발생하는 reflow와 repaint에 대해 알아봅시다.\n또 어떻게 하면 이를 최소화해 웹 페이지를 효율적으로 조작할 수 있을지 생각해봅시다."
tags: [browser, optimization]
createdAt: 2022/09/15
---

해당 글은 원문을 번역한 글입니다. 원문은 아래 링크를 참고해주세요.

[https://www.hi-interactive.com/blog/avoid-reflow-repaint](https://www.hi-interactive.com/blog/avoid-reflow-repaint)

> ..We're probably doing some really stupid things in CSS we don't know about...

이 문장은 Douglas Crockford가 2009년쯤 말한 것이고, 이것을 해당 아티클의 출발점으로 사용하고자 합니다.

몇 년 전만 해도 브라우저는 텍스트, 표, 입력폼, 이미지를 표시하고 때때로 복잡한 그래픽 애니메이션인 GIF를 표시하기 위한 용도로 사용되었습니다.

![](https://velog.velcdn.com/images/inyeop/post/c31bf12b-31a3-420e-9f03-034960d1c32d/image.gif)

우리는 브라우저가 이것들을 어떻게 렌더링하는지에 대해 알 필요가 없었습니다. 오히려 이것보다는 여러 브라우저에서 잘 작동하는지에 노력과 시간을 들였습니다.

우리는 CSS, JS 그리고 HTML을 배우는 데 익숙했고 성능보다는 컴플라이언스에 주의를 기울였습니다. 이러한 방식은 왜 이렇게 동작하는지 혹은 옳게 동작하는지 여부를 알지 못한 채 작업하도록 했습니다. 우리는 그저 동작하기 때문에 이를 간단하게 처리했습니다.

당시에는 이런 것과 관련된 도구가 없었고 심지어 이를 배울 필요 또한 없었습니다. 하지만 모던 브라우저, 모바일 그리고 모바일 웹과 함께 모든 것들이 바뀌기 시작했습니다.

모던 브라우저는 우리의 코드를 검사하고 이를 이해할 수 있는 기능을 제공합니다. 이것은 의미없는 CSS 속성이나 JS 한 줄로 인해 페이지를 로드하는데 15초가 더 오래 걸리고 CPU가 최대 속도로 실행됭다는 것을 알려줍니다.

한편 모바일 사이드에서는 스크린에 로드하는 항목의 양에 주의를 기울이도록 하고 휴대폰의 느린 속도를 고려하여 코드를 다르게 작성해야 했습니다.

마지막으로 모던 웹은 오늘 날 우리가 _강제로_ 만들어야 하는 놀랍고 정신 나간 것들에 대한 책임을 가집니다. 실제로 이를 이해하지 않고 기술적으로 무언가 동작하게끔 하는 방법만 알고 있다는 결과적으로 형편없는 애니메이션이나 인터렉션이 될 것이라는 것을 강조했습니다.

따라서 이 아티클의 목표는 솔루션을 보여주고 치명적인 실수를 저지르면 웹 어플리케이션에 심각한 피해를 주어 잠재 고객이 너무 기다린 나머지 다른 곳에서 쇼핑을 할 수 있음을 입증하고자 합니다.

## How a Browser Renders a Page

본론에 앞서 먼저 브라우저가 페이지를 어떻게 렌더링하는지 이해할 필요가 있습니다.

![](https://velog.velcdn.com/images/inyeop/post/b9c62b99-775c-4010-b492-7ea6b4ef20b3/image.png)

1. 유저가 URL을 통해 접속하면 브라우저는 HTML 소스코드를 서버 혹은 로컬에서 요청하고 파싱을 한다. 그 후에는 우리 모두 알고 있는 `<head>`, `<body>`, `<div>` 형식의 토큰으로 변형하고 이를 노드로 변형한다. 이렇게 DOM Tree를 구축하게 된다.
2. DOM Tree 구축 이후에는 CSS를 활용해 CSSOM Tree를 구축한다. 이때 많은 일이 발생하지만 생략.
3. 마침내 DOM Tree와 CSSOM Tree를 결합해 Render Tree를 구축하게 된다.

   - 렌더트리는 다음 과정을 통해 구축된다.

   1. dom tree의 루트부터 시작해 실제로 보일 요소와 computed styled를 연산한다.
   2. meta, script, link 와 같은 요소 그리고 display:none 처리된 것들은 무시한다.
   3. 각 보이는 노드들을 CSSOM 규칙에 따라 적용한다.

4. 위 과정을 모두 마치게 되면 브라우저는 요소들을 어떻게 보일지(Layout), 스크린에 어떻게 그릴지(Paint)를 고민한다.

## Reflow

정의에 따르면 Reflow는 브라우저가 document에서 요소의 위치와 크기를 재연산하는 과정이라고 한다. 이는 어떤 DOM 변경이 있을 때마다 각 요소들을 어느 위치에 두어야 할지 연산하는 브라우저의 리소스를 사용하는 작업이다.

Reflow는 요소에 대한 변경 사항이 페이지의 일부 또는 전체 레이아웃에 영향을 줄 때 발생합니다. 요소의 Reflow는 DOM의 모든 요소 및 후속 요소들의 Reflow를 유발합니다.

또한 Reflow는 마칠 때까지 유저가 인터렉션을 할 수 없는 유저 블로킹 작업이라는 것을 명심해야 합니다.

## Repaint

Repaint는 브라우저가 배경색이나 글꼴 크기와 같이 렌더링된 트리에 배치된 요소에 올바른 모양을 주는 과정입니다.

Repainting은 숨겨진 요소를 표시하거나 애니메이션 혹은 텍스트 색상을 변경하는 상황에서도 발생합니다.

## What may cause Reflow and Repaint

아래의 태스크들을 통해 언제 repaint, reflow가 발생하는지 확인해봅시다.

- **padding/margin/border와 같은 CSS 속성 변경 시**: Reflow, Repaint
- **background/border-color와 같은 CSS 속성 변경 시**: Repaint
- **font-size 변경 시**: Reflow, Repaint
- **엘리먼트 삽입 및 삭제**: Reflow, Repaint
- **display:none을 사용한 요소 숨김 처리**: Reflow, Repaint
- **visibility:hidden을 사용한 요소 숨김 처리**: Repaint
- **Window resize**: Reflow
- **StyleSheet의 추가 혹은 제거**: Reflow, Repaint
- **Window scroll**: Reflow(레이아웃 변경에 영향을 미치는 경우), Repaint
- **getComputedStyle()**: Reflow
- **window demensions 값에 접근**: Reflow
- **scroll()**: Reflow
- **box metrix 값에 접근**: Reflow
- **element.focus()**: Reflow
- **input에 텍스트 입력**: Reflow, Repaint
- **style attribute 사용**: Reflow, Repaint
- **class attribute 조작**: Reflow, Repaint(visual 변경에 영향을 미칠 경우)

보이듯 Reflow와 Repaint를 유발하는 다양한 액션들이 있습니다. 이들은 유저로 하여금 앱이 느리다고 느끼게끔 할 수 있는 것들입니다. 그리고 우리 중 상당수는 이 액션으로 인한 이 일에 책임이 있다는 사실조차 몰랐을 것입니다. 이전에 이야기했듯 가끔 우리는 그저 동작하는 것에 집중했기 때문입니다.

이것들을 효과적으로 최적화하는 것에 대해 이야기하기 전에 위에 나열한 몇 가지 항목에 대해서 생각해봅시다.

## Calling JS getComputedStyle(), window dimensions, scroll() or box metrics

모던 브라우저는 점점 똑똑해지고 있습니다. 적어도 브라우저는 엉망으로 작성된 코드를 효율적으로 동작하게 하기 위해 노력하고 있습니다. 예를 들어 모던 브라우저는 변경 사항에 대한 Queue를 두고 이를 일괄적으로 처리합니다. 만약 몇몇의 DOM 조작을 유발하는 코드가 있을 때 브라우저는 요청을 Queue에 넣고 일정 시간이 경과하거나 일정 수의 변경 사항에 도달하면 대기열을 flush할 수 있습니다. 이를 결정하는 것은 전적으로 브라우저에 달려 있습니다.

이러한 동작은 개발자가 실수로 작성한 코드가 비효율적으로 동작하지 않도록 하는 좋은 최적화 메커니즘입니다.

![](https://velog.velcdn.com/images/inyeop/post/df638218-de19-4433-9e32-f465c283e7ab/image.jpg)

때때로 우리의 스크립트는 브라우저가 이 변경 Queue를 사용하는 것을 방지하고 해당 대기열을 비우고 모든 일괄 변경을 수행하도록 합니다. 일반적으로 DOM의 Style 정보를 요청할 때 이런 일이 발생합니다.

만약 요소의 top 값을 스크린에 위치에 따라 변경한다고 가정해봅시다.

```js
element.style.top = element.offsetTop + "8px";
```

이 코드가 실행될 때 일어나는 일을 생각해봅시다. 이는 브라우저에게 offsetTop 정보를 요청해서 "이봐, 가장 최신 정보를 제공해!" 라고 이야기하는 것입니다. 브라우저는 Queue에 쌓아둔 변경 사항에 대한 정보를 모두 반영하여 최신의 값을 활용하기 위해 전체 대기열을 비우고 모든 작업을 실행한 다음 화면을 Reflow/Repaint 해야 최종적으로 올바른 정보를 스크립트에 제공할 수 있습니다.

또한 우리는 하나의 Reflow 요청만 추가했지만 이로 인해 더 많은 이벤트가 발생될 수 있습니다.

이제 루프 내부와 같이 이런 요청이 연속적으로 발생한다고 상상해보세요. 이런 현상은 피하거나 최소한으로 줄여야 합니다.

## How to minimise repaints and reflows

아마 여기까지 읽으면 "그러면 어떻게 해야 Reflow와 Repaint를 줄일 수 있는데?" 라고 생각할 수 있습니다.

다음부터 Reflow를 피하는 몇가지 팁과 불가피한 경우 이를 줄일 수 있는 방법에 대해서 이야기해보겠습니다.

### Reduce DOM depth

DOM의 depth를 줄이라는 말의 의미는 당신이 작성한 부모 요소 아래의 20개의 div 태그 혹은 span 태그는 필요하지 않을 수 있다는 말입니다. Reflow가 발생되면 변경된 노드의 위와 아래에 있는 DOM Tree 노드도 Reflow가 발생되고 자연스럽게 노드가 많을수록 브라우저에서 더 많은 노력을 기울여야 합니다.

### Hava a clean CSS sheet

Repainting은 브라우저의 시간과 리소스를 소모하는 작업이기 때문에 가능한 적은 속성을 가지는 것은 이를 스크린에 그리기 좋은 방식입니다. CSS에 불필요한 속성들은 제거해야 함을 기억하세요.

또한 CSS 선택자를 불필요하게 남용하지 않아야 합니다. 이는 CPU에서 연산이 이루어지기 때문입니다.

### Don't change individual CSS styles

우리는 자주 유저의 인터렉션에 의해 몇몇 스타일을 변경하고는 합니다. 다음 시나리오에서 여러 스타일을 변경하는 대신 하나의 클래스를 적용하는 방법은 더 효과적인 변경 방식의 사례입니다.

```js
// Bad
let left = 8, top = 8;
element.style.left = left + 'px;
element.style.top = top + 'px;

// Better
element.classList.add += 'modifier';
```

위 예시에서 두번의 reflow를 발생시키는 대신 한번의 reflow만 발생시킬 수 있습니다.

다른 좋은 방법 중 하나로는 감싸고 있는 부모 엘리먼트에 적용시키는 것보다 구체적인 요소에 적용시킬 수 있습니다. 이런 방식은 브라우저에게 Reflow에 필요한 Render Tree를 관리하기 더 수월하게끔 도와줄 수 있습니다.

cssText 또한 좋은 해결방법이 될 수 있습니다. 하지만 너무 자주 사용하지는 마세요.

```js
element.style.cssText += `; left: ${left}px; top: ${top}px;`;
```

### Batch DOM Changes

많은 요소에 변경을 해야 하는 경우에는 두가지 옵션이 있을 수 있습니다.

- 변경이 필요한 노드를 복사하고 이에 필요한 변경을 반영한 이후에 기존 노드를 대체하는 방법. 복제 대신 요소를 새롭게 생성하고 대체하는 방법도 이와 동일한 효과를 가집니다.

```js
const myNode = document.getElementById("element");
const myNodeClone = myNode.cloneNode(true);

myNodeClone.classList.add("background-green");
myNodeClone.style.left = "10px";

myNode.parentNode.replaceChild(myNode, myNodeClone);
```

위 경우는 한번의 reflow와 한번의 Repaint를 발생시킵니다.

- 노드를 숨김 처리한 후 변경을 반영하고 다시 보이도록 하는 방법

```js
const myNode = document.getElementById("element");
myNode.style.cssText += "; display:none;";

myNode.classList.add("background-green");
myNode.style.left = "10px";

myNode.style.cssText += "; display:block;";
```

위 경우는 두번의 reflow와 두번의 Repaint를 발생시킵니다.

### Avoid to much computed styles

.offsetTop이나 .clientHeight와 같은 계산된 스타일에 접근할 때마다 브라우저는 정확한 값을 얻기 위해서 큰 노력을 들여야만 합니다. 이와 같은 요청을 피하는 것은 당신의 코드를 훨씬 더 개선시킬 수 있습니다.

기본적으로 정보를 필요한 경우 한번만 요청하고 이를 따로 저장한 후 이를 사용하도록 합시다.

```js
const myNode = document.getElementById('element');
const left = myNode.offsetLeft;
const top = myNode.offsetTop;
const style = myNode.style;

for (loop here) {
  style.left = left + '10px'
  style.top = top + '10px'
}
```

### Avoid inline styles

위에서 살펴봤듯 스타일 속성을 통해 이를 설정하는 것은 Reflow를 발생시키고 결과적으로 동일한 요소에 여러 스타일을 적용하더라도 각각 Reflow를 발생시킬 수 있습니다.

### Use absolute/fixed positioning

앱의 아름다운 애니메이션은 amazing합니다. 하지만 고사양의 휴대폰에서만 동작한다면 이는 가치가 덜합니다. 성능 향상을 위한 몇 가지 사례를 고려하지 않으면 대부분의 사용자는 애니메이션 오류를 겪게 됩니다.

일반적으로 요소의 애니메이션 효과가 느리고 결함이 있는 원인은 브라우저가 화면을 Reflow하고 Repainting 하는데 투입되는 Resource의 양 때문입니다.

간단하게 이야기해서 GPU를 사용하여 브라우저에게 더 많은 처리 능력을 제공할 수 있습니다. 이를 위해 몇 가지 트릭을 사용할 수 있습니다.

CSS를 활용한 개선 트릭 중 하나로 애니메이션을 적용할 요소에 absolute나 fixed 포지션을 적용하는 것입니다. 이렇게 하게 되면 애니메이션이 적용된 요소는 다른 요소들의 레이아웃에 영향을 주지 않습니다. 요소가 문서 상위 요소의 자식이 되고 전체 DOM Reflow가 아닌 일부에 대해서만 Reflow가 발생하기 때문입니다. 이는 브라우저의 비용을 절감합니다.

### Reduce the “unnecessary” smoothness

일반적으로 화면의 요소에 애니메이션을 적용해야 할 때 한번에 1픽셀씩 이동할 수 있지만 더 긴 애니메이션의 경우 CPU가 Reflow와 후속 계산을 처리하는데 어려움을 겪을 수 있습니다. 대신 한번에 3px이나 4px씩 이동시켜 CPU가 수행해야 하는 Reflow 및 계산의 양을 줄일 수 있습니다.

이를 통해서 더 빠른 장치에서 부드러움을 잃지 않고 구형 장치의 경우 애니메이션이 장치를 느리게 만들어 사용자 경험을 손상시키지 않도록 할 수 있습니다.

## Tools to help us

다행스럽게도 오늘날 우리에게는 코드의 임팩트와 우리가 만든 pain point를 이해할 수 있게 도와주는 도구들이 있습니다.

### Browser Dev Tools (inspector)

브라우저의 개발자 도구는 요소와 페이지가 어떻게 렌더링되었는지, 얼만큼의 reflow와 repaint가 발생했는지를 보여줍니다.

아래 예는 크롬의 개발자 도구입니다.

![](https://velog.velcdn.com/images/inyeop/post/4bb1cd04-3847-4967-8092-b71cc60765d5/image.png)

위 예에서는 위키피디아의 페이지를 사용하고 있습니다. 우리는 페이지의 전체 로딩 프로세스의 일부를 확인할 수 있습니다.

![](https://velog.velcdn.com/images/inyeop/post/287c9ba9-8678-4d94-9ab1-dcfe2bc358c4/image.png)

Recording이 마무리되면 하단의 Summary 탭을 클릭해서 발생한 일의 이력을 확인할 수 있습니다.

![](https://velog.velcdn.com/images/inyeop/post/0ed422a5-79e9-40ba-a911-dd3fe0cd5505/image.png)

이것을 통해 Reflow(rendering)과 Repaint(painting)에서 250ms가 소요되었음을 알 수 있습니다.

다음 화면에서는 Reflow와 Repainting 관련된 이벤트를 볼 수 있습니다.

![](https://velog.velcdn.com/images/inyeop/post/2fa6e3ce-66a6-4d94-92c8-e6c50d1e0c04/image.png)

그리고 단일 레이아웃 이벤트를 더 자세히 살펴보면 해당 요청을 수행하는데 필요한 노드의 양과 시간을 확인할 수 있습니다.

![](https://velog.velcdn.com/images/inyeop/post/fcc2fe3b-5cca-4969-af1d-4df6a0772e1f/image.png)

인스펙터의 중간 섹션에서 이벤트를 순서대로 볼 수 있고 타임라인을 시각적으로 표시합니다. 여기서 확인할 수 있는 것은 이 시간동안 페이지가 차단되어서 유저가 페이지와 상호 작용을 할 수 없다는 것을 알 수 있습니다.

## Conclusions

> Make web faster instead of silk and smooth

이 아티클을 통해 아름다운 것보다 빠른 것이 가치있다는 주장을 하려는 것이 아닙니다. 여기서 주장하는 것은 성능이 우리의 최우선 순위여야 하며 사용자에게 완벽한 인터렉션을 제공할 수 없더라도 일반적으로 괜찮다는 것입니다. 사용자에게 가장 중요한 것은 빠르게 보여지는 것이기 때문입니다.

개인적으로 화려한 웹 앱과 화려한 UI를 활용한 현대 앱이 놀랍지만 내 액션에 따른 빠르게 응답하지 못하는 것에 지쳤습니다. 앱을 경험할 때 최대한 예쁘지 않더라도 빠르게 사용하고 싶습니다.
