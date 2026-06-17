/* =========================================================
   js/stages/stage5-numbers.js
   화면에 무작위로 흩어진 숫자를 1부터 순서대로 탭하는 미니게임
   ========================================================= */
(function () {
  window.STAGES.push({
    id: 'numbers',
    title: '순서 기억하기',
    init: function (container, ctx) {
      var total = 6;
      ctx.setInstruction('1부터 ' + total + '까지 순서대로 탭하세요.');

      var field = document.createElement('div');
      field.className = 'number-field';

      // 겹치지 않도록 위치를 무작위로 배치 (% 단위)
      var positions = [];
      var minDist = 24;
      function randPos() {
        return { x: 10 + Math.random() * 72, y: 8 + Math.random() * 76 };
      }
      var i, p, tries;
      for (i = 0; i < total; i++) {
        tries = 0;
        do {
          p = randPos();
          tries++;
        } while (
          tries < 30 &&
          positions.some(function (q) {
            return Math.hypot(q.x - p.x, q.y - p.y) < minDist;
          })
        );
        positions.push(p);
      }

      // 숫자 1~total을 무작위 순서로 위치에 배정
      var numbers = [];
      for (i = 1; i <= total; i++) numbers.push(i);
      for (i = numbers.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = numbers[i];
        numbers[i] = numbers[j];
        numbers[j] = tmp;
      }

      var next = 1;

      numbers.forEach(function (num, idx) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'number-dot';
        btn.textContent = String(num);
        var pos = positions[idx];
        btn.style.left = pos.x + '%';
        btn.style.top = pos.y + '%';

        btn.addEventListener('click', function () {
          if (btn.disabled) return;
          if (num === next) {
            btn.disabled = true;
            btn.classList.add('is-done');
            next += 1;
            if (next > total) ctx.succeed(100);
          } else {
            ctx.fail(num + '번을 순서보다 먼저 눌렀습니다.');
          }
        });

        field.appendChild(btn);
      });

      container.appendChild(field);
    }
  });
})();
