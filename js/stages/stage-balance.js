/* =========================================================
   js/stages/stage-balance.js
   슬라이더로 무게추를 옮겨 시소가 수평이 되도록 맞추는 미니게임.
   ========================================================= */
(function () {
  // 난이도별 허용 오차(슬라이더 단위)와 제한시간(초).
  var DIFF = {
    easy: { tolerance: 8, timeLimit: 9 },
    normal: { tolerance: 5, timeLimit: 7 },
    hard: { tolerance: 3, timeLimit: 6 }
  };

  window.STAGES.push({
    id: 'balance',
    title: '균형 맞추기',
    init: function (container, ctx) {
      var diff = DIFF[ctx.diffKey] || DIFF.normal;
      ctx.setTimeLimit(diff.timeLimit);
      var tolerance = diff.tolerance;
      var target = 15 + Math.random() * 70; // 15~85

      ctx.setInstruction('슬라이더로 무게추를 옮겨 시소가 수평이 되도록 맞춰주세요.');

      var stage = document.createElement('div');
      stage.className = 'balance-stage';

      var beam = document.createElement('div');
      beam.className = 'balance-beam';
      beam.innerHTML =
        '<span class="balance-weight balance-weight--left"></span>' +
        '<span class="balance-weight balance-weight--right"></span>';

      var pivot = document.createElement('div');
      pivot.className = 'balance-pivot';

      stage.appendChild(beam);
      stage.appendChild(pivot);

      var pos = 50;

      function render() {
        // 시각적 기울기 표현. 0.6은 외형상 기울기 민감도(보기 좋은 정도)를 위한 값입니다.
        var angle = (pos - target) * 0.6;
        angle = Math.max(-22, Math.min(22, angle));
        beam.style.transform = 'rotate(' + angle + 'deg)';
        beam.classList.toggle('is-level', Math.abs(pos - target) <= tolerance);
      }
      render();

      var slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '100';
      slider.value = String(pos);
      slider.className = 'rotate-slider';
      slider.addEventListener('input', function () {
        pos = parseFloat(slider.value);
        render();
      });

      var confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'btn btn-confirm';
      confirmBtn.textContent = '확인';
      confirmBtn.addEventListener('click', function () {
        confirmBtn.disabled = true;
        if (Math.abs(pos - target) <= tolerance) ctx.succeed(100);
        else ctx.fail('아직 균형이 맞지 않았습니다.');
      });

      container.appendChild(stage);
      container.appendChild(slider);
      container.appendChild(confirmBtn);
    }
  });
})();
