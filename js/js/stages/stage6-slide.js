/* =========================================================
   js/stages/stage6-slide.js
   슬라이드 퍼즐 캡차 패러디
   슬라이더로 조각을 옮겨 점선으로 표시된 빈 자리에 맞춥니다.
   ========================================================= */
(function () {
  // 난이도별 허용 오차(%)와 제한시간(초).
  var DIFF = {
    easy: { tolerance: 7, timeLimit: 9 },
    normal: { tolerance: 4, timeLimit: 7 },
    hard: { tolerance: 2.5, timeLimit: 5 }
  };

  window.STAGES.push({
    id: 'slide',
    title: '조각 맞추기',
    init: function (container, ctx) {
      var diff = DIFF[ctx.diffKey] || DIFF.normal;
      ctx.setTimeLimit(diff.timeLimit);
      var tolerance = diff.tolerance; // 허용 오차(%)
      var target = 20 + Math.random() * 60; // 20~80%

      ctx.setInstruction('퍼즐 조각을 슬라이더로 옮겨 점선으로 표시된 자리에 정확히 맞춰주세요.');

      var track = document.createElement('div');
      track.className = 'slide-track';

      var notch = document.createElement('div');
      notch.className = 'slide-track__notch';
      notch.style.left = 'calc(' + target + '% - 18px)';

      var piece = document.createElement('div');
      piece.className = 'slide-track__piece';

      track.appendChild(notch);
      track.appendChild(piece);

      var pos = 0;
      function render() {
        piece.style.left = 'calc(' + pos + '% - 18px)';
      }
      render();

      var slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '100';
      slider.value = '0';
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
        else ctx.fail('조각이 정확히 맞지 않습니다.');
      });

      container.appendChild(track);
      container.appendChild(slider);
      container.appendChild(confirmBtn);
    }
  });
})();
