/* =========================================================
   js/stages/stage-pattern.js
   4개의 패드가 순서대로 깜빡이고, 사용자가 같은 순서로 다시 눌러야 하는 미니게임.
   (Simon Says 형태의 짧은 기억력 테스트)
   ========================================================= */
(function () {
  var PAD_COUNT = 4;
  var FLASH_MS = 450;
  var GAP_MS = 250;

  // 난이도별 패턴 길이와 제한시간(초).
  var DIFF = {
    easy: { length: 3, timeLimit: 14 },
    normal: { length: 4, timeLimit: 12 },
    hard: { length: 5, timeLimit: 10 }
  };

  window.STAGES.push({
    id: 'pattern',
    title: '패턴 기억하기',
    init: function (container, ctx) {
      var diff = DIFF[ctx.diffKey] || DIFF.normal;
      ctx.setTimeLimit(diff.timeLimit);
      ctx.setInstruction('순서대로 깜빡이는 패턴을 잘 보고, 같은 순서로 다시 눌러주세요.');

      var sequence = [];
      var i;
      for (i = 0; i < diff.length; i++) {
        sequence.push(Math.floor(Math.random() * PAD_COUNT));
      }

      var wrap = document.createElement('div');
      wrap.className = 'pattern-stage';

      var grid = document.createElement('div');
      grid.className = 'pattern-grid';

      var statusEl = document.createElement('p');
      statusEl.className = 'pattern-status';
      statusEl.textContent = '패턴 재생 중...';

      var pads = [];
      for (i = 0; i < PAD_COUNT; i++) {
        var pad = document.createElement('button');
        pad.type = 'button';
        pad.className = 'pattern-pad';
        pad.disabled = true; // 재생이 끝나기 전까지는 입력 불가
        grid.appendChild(pad);
        pads.push(pad);
      }

      wrap.appendChild(grid);
      wrap.appendChild(statusEl);
      container.appendChild(wrap);

      var resolved = false;
      var inputIndex = 0;

      function flashPad(idx, done) {
        pads[idx].classList.add('is-flash');
        setTimeout(function () {
          pads[idx].classList.remove('is-flash');
          setTimeout(done, GAP_MS);
        }, FLASH_MS);
      }

      function playSequence(i2) {
        if (i2 >= sequence.length) {
          statusEl.textContent = '같은 순서로 눌러주세요.';
          pads.forEach(function (p) {
            p.disabled = false;
          });
          return;
        }
        flashPad(sequence[i2], function () {
          playSequence(i2 + 1);
        });
      }

      setTimeout(function () {
        playSequence(0);
      }, 500);

      pads.forEach(function (pad, idx) {
        pad.addEventListener('click', function () {
          if (resolved || pad.disabled) return;

          pad.classList.add('is-flash');
          setTimeout(function () {
            pad.classList.remove('is-flash');
          }, 180);

          if (idx === sequence[inputIndex]) {
            inputIndex += 1;
            if (inputIndex >= sequence.length) {
              resolved = true;
              ctx.succeed(100);
            }
          } else {
            resolved = true;
            ctx.fail('순서가 일치하지 않습니다.');
          }
        });
      });
    }
  });
})();
