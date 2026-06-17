# AI가 아닙니다

"나는 로봇이 아닙니다" 류의 보안 인증(캡차) 화면을 패러디한 모바일 웹 게임입니다.
순수 HTML/CSS/JS로만 만들어졌고, 이미지 파일이 전혀 없습니다(아이콘은 모두 인라인 SVG).
빌드 과정이 필요 없어서 GitHub Pages에 그대로 올리면 바로 동작합니다.

## 게임 규칙

- 목숨은 3개입니다. 한 단계에서 틀리거나 제한시간을 넘기면 목숨이 1개 줄고, 같은 단계가 다른 문제로 다시 출제됩니다.
- 목숨을 모두 잃으면 그 즉시 인증 실패로 게임이 끝납니다.
- 타이틀 화면에서 난이도(쉬움/보통/어려움)를 선택할 수 있습니다. 목숨 개수는 난이도와 무관하게 항상 3개이고,
  각 단계의 허용 오차·문제 개수·제한시간과 최종 점수 배율이 난이도에 따라 달라집니다.
- 12개 단계를 모두 통과하면 점수와 등급(S/A/B/C/D)이 표시됩니다. 등급은 "이론상 최대 점수 대비 실제 획득 점수의 비율"로 계산합니다.
- 단계를 연속으로 통과할 때마다 콤보가 쌓이고, 콤보 보너스 점수(최대 +50/단계)가 기본 점수(100점)에 더해집니다.
  한 번 실패하면 콤보는 0으로 초기화됩니다.
- 화면 우상단의 스피커 아이콘으로 사운드를 켜고 끌 수 있습니다. 모든 사운드는 음원 파일이 아니라
  Web Audio API로 그 자리에서 합성한 전자음(비프음)입니다.

## 폴더 구조

```
index.html                   화면 구조 (타이틀 / 게임 / 결과 3개 화면, 난이도 선택 UI 포함)
css/
  style.css                   전체 디자인(색상·레이아웃·12개 미니게임 스타일·타이머/콤보 UI)
js/
  icons.js                    인라인 SVG 아이콘 모음 (window.GameIcons)
  sound.js                    전자음 사운드 이펙트 시스템 (window.GameSound, 음원 파일 없음)
  stages-init.js               window.STAGES 배열 초기화 (가장 먼저 로드되어야 함)
  stages/
    stage1-signs.js            표지판 인식 (아이콘 타일 선택)
    stage2-checkbox.js         로봇이 아닙니다 확인 (길게 누르기 + 게이지)
    stage3-text.js              왜곡된 문자 인식 (텍스트 입력)
    stage-pattern.js            패턴 기억하기 (플래시 시퀀스 재현) — 신규
    stage4-rotate.js            방향 맞추기 (슬라이더로 회전)
    stage-swipe.js              스와이프 방향 인식 — 신규
    stage5-numbers.js           순서 기억하기 (숫자 순서대로 탭)
    stage-hidden-shape.js       숨은 도형 찾기 — 신규
    stage6-slide.js              조각 맞추기 (슬라이더로 퍼즐 조각 이동)
    stage-sort.js                크기 순서 맞추기 (탭으로 두 막대 교체) — 신규
    stage7-rhythm.js            리듬 탭 (펄스 타이밍 맞추기)
    stage-balance.js            균형 맞추기 (시소 슬라이더) — 신규
  main.js                       난이도/타이머/콤보/점수/화면 전환 컨트롤러 (가장 나중에 로드되어야 함)
```

각 스테이지 파일은 독립된 IIFE(즉시실행함수)로 작성되어 있어서, 서로의 변수를 침범하지 않습니다.
`stages-init.js`가 만든 `window.STAGES` 배열에 자신을 등록하기만 하고, `main.js`가 그 배열을 순서대로 실행합니다.

> **파일명과 실제 등장 순서는 다릅니다.** 기존 7개 파일은 처음 만들 때 이름(`stage1`~`stage7`)을 그대로 유지하고 있고,
> 새로 추가된 5개 파일은 위치 번호 대신 내용으로 이름을 지었습니다(`stage-pattern.js` 등). 실제로 게임에서 등장하는 순서는
> 파일명이 아니라 **`index.html`에 `<script>` 태그를 적은 순서**로 결정됩니다. 단계 순서를 바꾸려면 `index.html`의
> 스크립트 태그 순서만 바꾸면 됩니다.

## GitHub Pages로 배포하는 방법

1. 이 폴더 전체를 GitHub 저장소에 푸시합니다 (index.html이 저장소 루트에 있어야 합니다).
2. 저장소의 **Settings → Pages**로 이동합니다.
3. **Source**를 `Deploy from a branch`로, 브랜치는 `main`(또는 사용 중인 기본 브랜치), 폴더는 `/ (root)`로 설정합니다.
4. 잠시 후 `https://[사용자명].github.io/[저장소명]/` 주소로 접속하면 게임이 바로 실행됩니다.
   별도의 빌드 명령이나 패키지 설치가 필요 없습니다.

## 새로운 단계 추가하는 방법

1. `js/stages/` 폴더에 새 파일(예: `stage-새기능.js`)을 만들고, 기존 스테이지 파일과 동일한 형태로 작성합니다.

```js
(function () {
  // 난이도별로 달라지는 값은 이런 식으로 표를 만들어두면 나중에 조정하기 쉽습니다.
  var DIFF = {
    easy: { timeLimit: 10 },
    normal: { timeLimit: 8 },
    hard: { timeLimit: 6 }
  };

  window.STAGES.push({
    id: 'my-new-stage',
    title: '내 새 단계',
    init: function (container, ctx) {
      var diff = DIFF[ctx.diffKey] || DIFF.normal;
      ctx.setTimeLimit(diff.timeLimit); // 모든 스테이지는 init 시작 부분에서 반드시 한 번 호출해야 합니다.
      ctx.setInstruction('안내 문구');
      // container에 원하는 UI를 추가하고,
      // 정답이면 ctx.succeed(100), 오답이면 ctx.fail('실패 메시지')를 호출하세요.
    }
  });
})();
```

`ctx`로 전달되는 것들:

| 항목 | 설명 |
| --- | --- |
| `ctx.diffKey` | 현재 선택된 난이도(`'easy' \| 'normal' \| 'hard'`). 스테이지 자체 `DIFF` 표에서 값을 꺼낼 때 사용합니다. |
| `ctx.setTimeLimit(seconds)` | 이 단계의 제한시간을 등록합니다. **반드시 한 번 호출해야 하며**, 시간이 다 되면 자동으로 실패 처리됩니다. |
| `ctx.setInstruction(text)` | 안내 문구를 표시합니다. |
| `ctx.succeed(points)` | 통과 처리. `points`를 생략하면 기본 100점이 들어갑니다(콤보 보너스는 main.js가 자동으로 더합니다). |
| `ctx.fail(message)` | 실패 처리. 목숨이 줄고 콤보가 초기화됩니다. |

2. `index.html`의 `<script src="js/stages/...">` 목록에서 **`js/main.js`보다 앞쪽에** 새 스크립트 태그를 추가합니다.
   스크립트 태그를 추가한 위치가 곧 게임에서 등장하는 단계 순서입니다.

## 난이도(레벨 디자인) 조정 포인트

각 스테이지 파일 맨 위에 `DIFF = { easy: {...}, normal: {...}, hard: {...} }` 형태의 표가 있습니다.
이 값들을 바꾸면 해당 난이도에서의 체감이 달라집니다.

| 파일 | 난이도별로 조정되는 값 |
| --- | --- |
| `stage1-signs.js` | 제한시간만 조정 (타일 개수·정답 개수는 고정) |
| `stage2-checkbox.js` | 정답 구간 폭(`zoneWidth`), 게이지가 차는 시간(`duration`), 제한시간 |
| `stage3-text.js` | 문자 개수(`length`), 제한시간 |
| `stage-pattern.js` | 패턴 길이(`length`), 제한시간 |
| `stage4-rotate.js` | 방향 허용 오차(`tolerance`, 도), 제한시간 |
| `stage-swipe.js` | 최소 스와이프 거리(`minDist`, px), 제한시간 |
| `stage5-numbers.js` | 숫자 개수(`total`), 제한시간 |
| `stage-hidden-shape.js` | 도형 개수(`count`), 제한시간 |
| `stage6-slide.js` | 퍼즐 조각 허용 오차(`tolerance`, %), 제한시간 |
| `stage-sort.js` | 막대 개수(`count`), 제한시간 |
| `stage7-rhythm.js` | 타이밍 허용 오차(`windowHalf`, ms), 제한시간. (펄스 주기 `CYCLE_MS`는 CSS 애니메이션과 맞춰야 해서 난이도와 무관하게 고정) |
| `stage-balance.js` | 균형 허용 오차(`tolerance`, 슬라이더 단위), 제한시간 |
| `main.js`의 `DIFFICULTY_PRESETS` | 난이도별 최종 점수 배율(`scoreMul`). 쉬움 0.8배 · 보통 1배 · 어려움 1.25배 |
| `main.js`의 `COMBO_BONUS_STEP` / `COMBO_BONUS_CAP` | 콤보 1단계당 보너스(현재 10점)와 콤보 보너스 최대치(현재 50점) |
| `main.js`의 등급 기준(`finishGame` 내부 `pct` 분기) | 점수 비율에 따른 S/A/B/C/D 등급 경계값(현재 90/75/55/35%) |
| `sound.js`의 `SOUNDS` | 상황별(통과/실패/콤보/시간경고/시작/클리어/오버) 전자음의 음 높이·길이·파형(`type`) 조합 |

## 사운드 시스템

`js/sound.js`는 오디오 파일을 전혀 쓰지 않고, Web Audio API의 오실레이터로 모든 사운드를 즉석에서 합성합니다
(아이콘을 이미지 대신 SVG로 그리는 것과 같은 접근 방식입니다). `window.GameSound.play('success')`처럼 이름으로
호출하면 되고, 현재 다음 상황에 자동으로 연결되어 있습니다.

| 사운드 이름 | 재생 시점 |
| --- | --- |
| `tap` | 단계 안의 모든 버튼 클릭 (단계 파일을 건드리지 않고 `main.js`에서 위임 처리) |
| `stageStart` | 새 단계가 시작될 때 |
| `success` / `comboUp` | 단계 통과 시 / 콤보 보너스가 있을 때 추가로 |
| `fail` | 단계 실패 시 |
| `tick` | 남은 시간이 3초 이하로 줄어들 때마다 1초당 1회 |
| `gameStart` | "인증 시작하기"를 눌렀을 때 |
| `gameClear` / `gameOver` | 최종 인증 완료 / 인증 실패 시 |

화면 우상단의 음소거 버튼(`#btn-mute`) 상태는 `localStorage`에 저장되어 다음 방문 때도 유지됩니다.
모바일 브라우저의 자동재생 정책 때문에, 반드시 사용자의 클릭(시작 버튼, 음소거 버튼, 난이도 버튼 등) 안에서
`window.GameSound.unlock()`을 한 번 호출해 오디오 컨텍스트를 깨워둡니다.

## 동작 확인

Playwright로 헤드리스 브라우저 자동 테스트를 진행해 다음을 확인했습니다.

- **실패 경로**: 3번 연속 실패 시 정상적으로 "인증 실패" 화면(F등급)으로 끝나는지 확인.
- **정상 경로**: 보통 난이도로 12단계를 모두 결정론적인 전략으로 통과해, 제한시간/콤보 보너스/점수 비율 등급까지
  포함해 콘솔 에러 없이 끝까지 진행되는지 확인. (최종 결과 예시: 1560/1650점, S등급)
- 이 과정에서 스와이프 스테이지의 `pointerup`이 영역 밖으로 손가락이 나가면 인식되지 않는 문제를 발견해
  `setPointerCapture`로 수정했습니다(체크박스 길게 누르기 스테이지에도 동일하게 적용).
- 390×844(모바일) 화면 크기에서 타이틀(난이도 선택 포함)·12개 단계 전체·결과 화면을 스크린샷으로 검토했습니다.
