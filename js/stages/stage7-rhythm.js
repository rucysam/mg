/* =========================================================
   js/stages/stage7-rhythm.js
   원이 커지고 작아지는 펄스 애니메이션의 정점(가장 커진 순간)에
   탭해야 통과하는 미니게임. "자연스러운 인간의 타이밍"을 확인합니다.
   ========================================================= */
(function () {
  // 주의: 이 값은 CSS의 .rhythm-pulse 애니메이션 duration(1.6s)과 반드시 일치해야 합니다.
  var CYCLE_MS = 1600;
  var WINDOW_HALF_MS = 140; // 정점 기준 허용 오차

  window.STAGES.push({
    id: 'rhythm',
    title: '리듬 탭',
    init: function (container, ctx) {
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
        var diff = Math.abs(elapsed - peak);

        if (diff <= WINDOW_HALF_MS) ctx.succeed(100);
        else ctx.fail('타이밍이 맞지 않았습니다.');
      });

      container.appendChild(stage);
      container.appendChild(tapBtn);
    }
  });
})();
