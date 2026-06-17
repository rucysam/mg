/* =========================================================
   js/stages-init.js
   모든 스테이지 모듈이 자신을 등록하는 전역 배열입니다.
   이 파일은 반드시 stages/ 폴더의 모든 파일보다 먼저 로드되어야 합니다.

   각 스테이지는 아래 형태의 객체를 push 합니다:
   {
     id: '고유 id (문자열)',
     title: '화면 상단에 표시될 제목',
     init: function (container, ctx) {
       // container: 이 스테이지의 UI를 그릴 빈 div
       // ctx.setInstruction(text): 안내 문구 표시
       // ctx.succeed(points): 통과 처리 (points 기본값 100)
       // ctx.fail(message): 실패 처리 (목숨 1개 차감 후 같은 스테이지 재출제)
     }
   }
   ========================================================= */
window.STAGES = [];
