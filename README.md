# AI가 아닙니다

"나는 로봇이 아닙니다" 류의 보안 인증(캡차) 화면을 패러디한 모바일 웹 게임입니다.
순수 HTML/CSS/JS로만 만들어졌고, 이미지 파일이 전혀 없습니다(아이콘은 모두 인라인 SVG).
빌드 과정이 필요 없어서 GitHub Pages에 그대로 올리면 바로 동작합니다.

## 게임 규칙

- 목숨은 3개입니다. 한 단계에서 틀리면 목숨이 1개 줄고, 같은 단계가 다른 문제로 다시 출제됩니다.
- 목숨을 모두 잃으면 그 즉시 인증 실패로 게임이 끝납니다.
- 7개 단계를 모두 통과하면 점수(단계당 100점, 최대 700점)와 등급(남은 목숨 기준 S/A/B)이 표시됩니다.

## 폴더 구조

```
index.html               화면 구조 (타이틀 / 게임 / 결과 3개 화면)
css/
  style.css               전체 디자인(색상·레이아웃·7개 미니게임 스타일)
js/
  icons.js                인라인 SVG 아이콘 모음 (window.GameIcons)
  stages-init.js          window.STAGES 배열 초기화 (가장 먼저 로드되어야 함)
  stages/
    stage1-signs.js       1. 표지판 인식 (아이콘 타일 선택)
    stage2-checkbox.js    2. 로봇이 아닙니다 확인 (길게 누르기 + 게이지)
    stage3-text.js        3. 왜곡된 문자 인식 (텍스트 입력)
    stage4-rotate.js       4. 방향 맞추기 (슬라이더로 회전)
    stage5-numbers.js     5. 순서 기억하기 (숫자 순서대로 탭)
    stage6-slide.js       6. 조각 맞추기 (슬라이더로 퍼즐 조각 이동)
    stage7-rhythm.js      7. 리듬 탭 (펄스 타이밍 맞추기)
  main.js                  게임 진행/목숨/점수/화면 전환 컨트롤러 (가장 나중에 로드되어야 함)
```

각 스테이지 파일은 독립된 IIFE(즉시실행함수)로 작성되어 있어서, 서로의 변수를 침범하지 않습니다.
`stages-init.js`가 만든 `window.STAGES` 배열에 자신을 등록하기만 하고, `main.js`가 그 배열을 순서대로 실행합니다.

## GitHub Pages로 배포하는 방법

1. 이 폴더 전체를 GitHub 저장소에 푸시합니다 (index.html이 저장소 루트에 있어야 합니다).
2. 저장소의 **Settings → Pages**로 이동합니다.
3. **Source**를 `Deploy from a branch`로, 브랜치는 `main`(또는 사용 중인 기본 브랜치), 폴더는 `/ (root)`로 설정합니다.
4. 잠시 후 `https://[사용자명].github.io/[저장소명]/` 주소로 접속하면 게임이 바로 실행됩니다.
   별도의 빌드 명령이나 패키지 설치가 필요 없습니다.

## 새로운 단계 추가하는 방법

1. `js/stages/` 폴더에 새 파일(예: `stage8-새기능.js`)을 만들고, 기존 스테이지 파일과 동일한 형태로 작성합니다.

```js
(function () {
  window.STAGES.push({
    id: 'my-new-stage',
    title: '내 새 단계',
    init: function (container, ctx) {
      ctx.setInstruction('안내 문구');
      // container에 원하는 UI를 추가하고,
      // 정답이면 ctx.succeed(100), 오답이면 ctx.fail('실패 메시지')를 호출하세요.
    }
  });
})();
```

2. `index.html`의 `<script src="js/stages/...">` 목록에서 **`js/main.js`보다 앞쪽에** 새 스크립트 태그를 추가합니다.
   스크립트 태그를 추가한 순서가 곧 게임에서 등장하는 단계 순서입니다.

## 난이도(레벨 디자인) 조정 포인트

지금은 기본 동작 위주로 만들어서 난이도는 단순하게 잡혀 있습니다. 추후 다음 부분을 조정하면 됩니다.

| 위치 | 조정 항목 |
| --- | --- |
| `stage1-signs.js`의 `targetCount` | 정답 타일 개수 범위 (현재 2~4개) |
| `stage2-checkbox.js`의 `zoneWidth`, `DURATION` | 정답 구간 폭과 전체 게이지가 차는 시간 |
| `stage4-rotate.js`의 `tolerance` | 방향 허용 오차(도) |
| `stage6-slide.js`의 `tolerance` | 퍼즐 조각 허용 오차(%) |
| `stage7-rhythm.js`의 `WINDOW_HALF_MS` | 리듬 탭 허용 오차(ms) |
| `main.js`의 `RANK_BY_LIVES` | 남은 목숨에 따른 등급(S/A/B) 매핑 |
| `main.js`의 점수(100점/단계) | 단계별 획득 점수 |

## 동작 확인

Playwright로 헤드리스 브라우저 자동 테스트를 진행해, 7단계를 모두 정상적으로 통과해 점수 700점·S등급으로
끝나는 경로와, 3번 실패해 인증 실패로 끝나는 경로 모두 콘솔 에러 없이 정상 동작함을 확인했습니다.
또한 390×844(모바일) 화면 크기에서 7개 단계 전체와 타이틀/결과 화면을 스크린샷으로 검토했습니다.
