---
slug: how-to-develop-o2damn
title: 리듬게임 O2damn 개발기 🎮
description: "세상에서 가장 귀여운 리듬게임, O2damn은 어떻게 만들어졌는지 알아봅시다."
tags: [canvas, requestAnimationFrame]
createdAt: 2022/07/21
---

## 들어가며

혹시 게임을 좋아하는가? 나는 별로 좋아하지 않는다.
하지만 어린 시절에는 컴퓨터를 게임기라고 인지할 정도로 많은 시간 게임을 했다. 그렇다. 나는 과거 게임중독이었다.

그렇게 게임 소비자였던 내가 어쩌다보니 게임을 만들 수 있는 능력을 갖게 되어 공급자가 되다니 어른이 된 거 같은 기분이다.

이번에는 내가 만든 게임을 한번 소개해보려고 한다. 어린 시절 즐겨했던 리듬게임(O2Jam)을 모티브로 해 새롭게 만들어 보았다. 이런 류의 게임을 VSRG(Vertical Scrolling Rhythm Game)이라고 하던데 좀 생소하다. 여하간 이번 포스트에서 직접 만든 리듬게임 **O2damn** (오투댐) 을 만들며 알게 된 지식과 만드는 과정을 공유하려고 한다.

## Animation on Canvas

혹시 Canvas를 사용해본 적이 있는가? 나는 이 프로젝트를 진행하기 전에는 canvas에 대한 경험이 전무했다. 우연히 니콜라스 선생님의 Node.js로 캐치마인드 만들기 강의를 보고 '아 canvas로 그림판 같은 것도 만들 수 있겠구나' 싶었는데 찾다보니 생각보다 재밌는 것들을 만들 수 있는 토픽이라는 생각을 하게 되었다.

canvas를 통해 애니메이션을 구현할 때는 주로 window의 내장 함수 `requestAnimationFrame`를 활용하여 구현하게 된다. 간단한 예제를 살펴보자. 박스가 캔버스 왼쪽에서 오른쪽 끝까지 이동하는 애니메이션을 구현한다고 했을 때 이렇게 할 수 있다.

```ts
const $canvas = document.getElementById("canvas");
const context = $canvas.getContext("2d");

const canvasWidth = $canvas.width;
const canvasHeight = $canvas.height;

class Box {
  private positionX = 0;
  private positionY = canvasHeight / 2;
  private size = 30;

  public update() {
    this.positionX = this.positionX + 1;
    context.fillRect(this.positionX, this.positionY, this.size, this.size);
  }
}

const box = new Box();

function paint() {
  context.clearRect(0, 0, $canvas.width, $canvas.height); // clearRect(x, y, width, height)
  box.update();
  window.requestAnimationFrame(paint);
}

window.requestAnimationFrame(paint);
```

![](https://velog.velcdn.com/images/inyeop/post/9a178752-322f-4329-a0b7-fe24e97a32ed/image.gif)

놀랍다. css animation으로 만들면 길어야 네 다섯 줄의 코드로 충분할 것이 이렇게 많은 코드를 필요로 하다니. 하지만 자바스크립트를 통해 애니메이션을 구현한다면 요소의 움직임을 수동으로 조절해주어야 하기 때문에 어쩔 수 없다.

우선 paint 함수부터 살펴보자. 초기에 canvas를 초기화시켜주는 clearRect 함수를 호출한다. 그리고 Box의 상태(positionX)를 업데이트하고 화면에 그린다. 그리고 재귀적으로 paint 함수를 호출한다. clearRect 함수는 전달받은 인자의 영역만큼 clear, 즉 지워주는 역할을 한다. 왜일까? 그렇다. canvas에서 애니메이션은 다음과 같은 과정을 거쳐 구현한다.

1. 화면에 그림을 그린다.
2. 다 지운다.
3. 다음 화면을 그린다.
4. 다 지운다.
5. 다음 화면을 그린다..

..반복

![https://media.giphy.com/media/f9GORfPV2Gn8wGZTgC/giphy.gif](https://media.giphy.com/media/f9GORfPV2Gn8wGZTgC/giphy.gif)

마치 어릴 적 사먹던 풍선껌에 들어있는 만화책(flip book)과 같은 원리인 것이다.

### requestAnimationFrame

requestAnimationFrame는 window에 내장된 함수로 태생부터 애니메이션 구현을 위해 만들어진 것을 짐작할 수 있는 듯한 이름의 함수다.

이 함수는 setInterval이나 setTimeout과 같은 스케쥴링 함수 중 하나이지만 두번째 인자로 delay 값을 전달 받지 않는다는 차이가 있다. 그렇기 때문에 이 함수를 사용해 반복적으로 실행하고자한다면 함수 내부에서 스스로를 호출하는 재귀함수 형태로 구현해야만 지속적인 호출을 통해 애니메이션을 구현할 수 있다.

그렇다면 이 함수의 실행 주기는 어떻게 될까? requestAnimationFrame 함수는 1초에 60회 호출되는 것(FPS: Frame per second)을 목표로 구현되어 있는 것으로 알고 있다. 여기서 60이라는 값은 아무렇게나 정한 값이 아닌 일반적인 디바이스(모니터, 노트북 화면, 디스플레이 디바이스 등)에서 새로 고침 시 반영할 수 있는 상한선이기에 정해진 값이라고 한다.

물론 이 횟수는 목표(goal)일 뿐 전달받은 콜백의 복잡도나 현재 브라우저에서 처리하고 있는 작업 등에 따라 횟수가 줄어들 수 있다.

requestAnimationFrame은 다른 timer 함수들과 차별화된 특장점을 가지고 있다. 가장 대표적으로 자체적으로 지연 호출을 통해 최적화를 한다는 것이다. setTimeout이나 setInterval 함수는 두번째로 전달한 인자값(시간)이 지나면 콜스택에 추가하여 누락없이 즉시 실행하도록 하는 반면에 raf는 브라우저에서 repaint를 할 준비가 되었을 때 콜백을 호출하도록 구현되어 있다고 한다. 예를 들어 setInterval 함수로 1000 / 60 회 paint를 하는 경우 화면에 그려지는지 여부와 상관없이 전달 받은 콜백을 모두 실행하는 반면 raf는 repaint가 준비될 때 호출(지연 호출)하기 때문에 화면에 그릴 수 없는 상황에서 전달 받은 콜백은 실행하지 않고 필요한 콜백만을 실행한다. 때문에 실행할 필요가 없는 코드는 스킵하고 필요한 콜백만 실행한다는 부분에서 다른 타이머 함수들과 다르게 최적화될 수 있다. 이 외에도 현재 탭이 out focusing 되었을 때 동작을 멈춘다거나 배터리 연결 상태, 컴퓨터 리소스 상태 등 외부 환경에 따라서 유연하게 동작하여 성능을 최적화한다는 것도 이 함수의 장점이라고 할 수 있다.

## Time Based Animation

애니메이션에서 움직이는 요소는 FPS에 영향을 받지 않고 지정한 속도로 동작하는 것이 중요하다. 위 함수 설명에서 언급했듯이 raf는 스스로를 호출하는 방식으로 구현해야 하고 그 주기는 이상적으로는 1초에 60회라고는 하지만 이 수치는 실행 환경이나 사양 등 다양한 변수에 의해 영향 받는 값이므로 이에 의존하게 되면 의도치 않은 애니메이션으로 구현될 여지가 있다.

위의 이동하는 박스 애니메이션 예제로 생각해보자. box의 update메서드에서는 한 프레임에 positionX를 1씩 증가하고 있다. 만약 프레임이 1초 20회 호출되는 processor에서라면 1초에 20px이 이동하게 되겠지만 1초에 60회 호출하는 환경이라면 1초에 60px이동하게 될 것이다.

![](https://velog.velcdn.com/images/inyeop/post/93578567-6851-4d85-a043-8436c6356c62/image.gif)

이를 해결하기 위해서는 우리 모두 아는 간단한 공식을 사용하면 된다.

> 거리(distance) = 시간(duration) \* 속도(speed)

O2damn에서는 특히나 음악에 맞춰 떨어지는 노트의 이동거리가 중요하기 때문에 이 거리를 계산하는 것이 무엇보다 중요한데 위 공식만 잘 적용한다면 processor에 의해 바뀌는 FPS가 아닌 오직 시간에만 참조하여 이동거리를 정확하게 구현할 수 있다.

```ts
class Box {
  private positionX = 0;
  private positionY = canvasHeight / 2;
  private size = 30;

  private speed = 100;
  private now = 0;
  private then = Date.now();
  private delta = 0;

  public update() {
    this.then = this.now;
    this.now = Date.now();
    this.delta = (this.now - this.then) / 1000; // 새로운 프레임이 실행되는 시간 - 이전에 프레임이 실행되었던 시간 / 1000
    this.positionX += this.delta * this.speed; // 거리 = 시간 * 속도

    context.fillRect(this.positionX, this.positionY, this.size, this.size);
  }
}

const box = new Box();

function paint() {
  context.clearRect(0, 0, $canvas.width, $canvas.height);

  box.update();
}
```

![](https://velog.velcdn.com/images/inyeop/post/9ca06994-6ea5-489b-b37b-91724824a473/image.gif)

이제 움직이는 요소들의 거리는 호출되는 주기가 다르더라도 같은 시간을 참조하고 그에 따라 거리를 연산하기 때문에 다른 FPS의 환경이더라도 동일한 움직임을 보장할 수 있게 되었다.

이렇게 캔버스에서 애니메이션을 구현하는 방법과 시간을 기반으로 한 애니메이션에 대한 이해가 모두 끝났다면 준비는 모두 마쳤다. 이제 샷추가한 아메리카노와 이 프로젝트를 끝내겠다는 의지를 가지고 밤을 새어가며 만들어나가면 아래와 같은 형태로 보이도록 할 수 있게 된다.

```json
{
  "notes": [
    { "key": 0, "time": 1 },
    { "key": 1, "time": 2 },
    { "key": 2, "time": 3 },
    { "key": 3, "time": 4 },
    { "key": 4, "time": 5 },
    { "key": 5, "time": 6 }
  ]
}
```

![](https://velog.velcdn.com/images/inyeop/post/d765dbb9-ae47-4c6a-8fcb-659307d3a0cc/image.gif)

## 마치며

O2damn은 내가 애정을 가지는 프로젝트 중 하나로 공개해도 될 만큼 다듬어지면 공유하고 싶은 바람이 있었는데 아무리 다듬어도 끝이 없을거 같다는 생각이 들어서 에라 모르겠다 심정으로 공개하려고 한다. 아직 기능적으로도 코드적으로도 부족한 부분들이 있지만 우선 공개한 후 차차 보완해가려고 한다. 구현에 대한 자세한 코드가 궁금하다면 아래 github 링크를 통해 살펴보고 피드백도 주면 고마울 거 같다. 그리고 재밌게 즐겼다면 repo에 star도 부탁한다.

**_Github_**

- [https://github.com/marco0212/O2damn](https://github.com/marco0212/O2damn)

**_참고 자료_**

- [https://www.viget.com/articles/time-based-animation](https://www.viget.com/articles/time-based-animation)
- [https://www.kirupa.com/html5/animating_with_requestAnimationFrame.htm](https://www.kirupa.com/html5/animating_with_requestAnimationFrame.htm)
