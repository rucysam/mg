/* =========================================================
   js/stages/stage7-rhythm.js
   원이 커지고 작아지는 펄스 애니메이션의 정점(가장 커진 순간)에
   탭해야 통과하는 미니게임. "자연스러운 인간의 타이밍"을 확인합니다.
   ========================================================= */
(function () {
  // 난이도별 타이밍 허용 오차(ms)와 단계 제한시간(초).
  // CYCLE_MS는 CSS의 .rhythm-pulse 애니메이션 duration(1.6s)과 반드시 일치해야 하므로 난이도와 무관하게 고정합니다.
  var CYCLE_MS = 1600;
  var DIFF = {
    easy: { windowHalf: 200, timeLimit: 8 },
    normal: { windowHalf: 140, timeLimit: 6 },
    hard: { windowHalf: 90, timeLimit: 5 }
  };

  window.STAGES.push({
    id: 'rhythm',
    title: '리듬 탭',
    init: function (container, ctx) {
      var diff = DIFF[ctx.diffKey] || DIFF.normal;
      ctx.setTimeLimit(diff.timeLimit);
      var windowHalf = diff.windowHalf;
      ctx.setInstruction('원이 가장 커지는 순간에 버튼을 탭하세요.');

      var stage = document.createElement('div');
      stage.className = 'rhythm-stage';

      var pulse = document.createElement('div');
      pulse.className = 'rhythm-pulse';
      stage.appendChild(pulse);

      var tapBtn = document.createElement('button');
      tapBtn.type = 'button';
      tapBtn.className = 'btn btn-confirm';
      tapBtn.textContent = '지금 탭!';

      var startTime = performance.now();
      var resolved = false;

      tapBtn.addEventListener('click', function () {
        if (resolved) return;
        resolved = true;
        tapBtn.disabled = true;

        var elapsed = (performance.now() - startTime) % CYCLE_MS;
        var peak = CYCLE_MS / 2;
        var timingDiff = Math.abs(elapsed - peak);

        if (timingDiff <= windowHalf) ctx.succeed(100);
        else ctx.fail('타이밍이 맞지 않았습니다.');
      });

      container.appendChild(stage);
      container.appendChild(tapBtn);
    }
  });
})();
