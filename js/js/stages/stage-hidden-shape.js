/* =========================================================
   js/stages/stage-hidden-shape.js
   비슷하게 생긴 도형들 사이에서 모양이 다른 하나를 찾아 탭하는 미니게임.
   ========================================================= */
(function () {
  // 난이도별 도형 개수와 제한시간(초). 개수가 많을수록 찾기 어려워집니다.
  var DIFF = {
    easy: { count: 6, timeLimit: 10 },
    normal: { count: 9, timeLimit: 8 },
    hard: { count: 12, timeLimit: 7 }
  };

  window.STAGES.push({
    id: 'hidden-shape',
    title: '숨은 도형 찾기',
    init: function (container, ctx) {
      var diff = DIFF[ctx.diffKey] || DIFF.normal;
      ctx.setTimeLimit(diff.timeLimit);
      ctx.setInstruction('모양이 다른 도형 하나를 찾아 탭하세요.');

      var oddIndex = Math.floor(Math.random() * diff.count);

      var grid = document.createElement('div');
      grid.className = 'shape-grid';

      for (var i = 0; i < diff.count; i++) {
        var cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'shape-cell';

        var shape = document.createElement('span');
        shape.className = i === oddIndex ? 'shape-shape shape-shape--odd' : 'shape-shape';
        cell.appendChild(shape);

        (function (idx) {
          cell.addEventListener('click', function () {
            if (idx === oddIndex) ctx.succeed(100);
            else ctx.fail('다른 도형이 아닙니다.');
          });
        })(i);

        grid.appendChild(cell);
      }

      container.appendChild(grid);
    }
  });
})();
