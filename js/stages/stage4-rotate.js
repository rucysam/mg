/* =========================================================
   js/stages/stage4-rotate.js
   기울어진 화살표를 슬라이더로 돌려 정방향(위)으로 맞추는 미니게임
   ========================================================= */
(function () {
  window.STAGES.push({
    id: 'rotate',
    title: '방향 맞추기',
    init: function (container, ctx) {
      var tolerance = 8; // 허용 오차(도)
      var angle = 30 + Math.floor(Math.random() * 300); // 30~330도 (이미 정답인 0도는 피함)

      ctx.setInstruction('화살표가 정확히 위를 향하도록 슬라이더로 돌려주세요.');

      var stage = document.createElement('div');
      stage.className = 'rotate-stage';

      var iconWrap = document.createElement('div');
      iconWrap.className = 'rotate-icon';
      iconWrap.innerHTML = window.GameIcons.arrowUp();
      iconWrap.style.transform = 'rotate(' + angle + 'deg)';
      stage.appendChild(iconWrap);

      var slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '359';
      slider.value = String(angle);
      slider.className = 'rotate-slider';
      slider.addEventListener('input', function () {
        angle = parseInt(slider.value, 10);
        iconWrap.style.transform = 'rotate(' + angle + 'deg)';
      });

      var confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'btn btn-confirm';
      confirmBtn.textContent = '확인';
      confirmBtn.addEventListener('click', function () {
        confirmBtn.disabled = true;
        var diff = Math.min(angle, 360 - angle);
        if (diff <= tolerance) ctx.succeed(100);
        else ctx.fail('방향이 정확하지 않습니다.');
      });

      container.appendChild(stage);
      container.appendChild(slider);
      container.appendChild(confirmBtn);
    }
  });
})();
